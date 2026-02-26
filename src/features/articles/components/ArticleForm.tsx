import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/common/ImageUpload'
import { SummernoteEditor } from '@/components/common/SummernoteEditor'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { FormSkeleton } from '@/components/common/skeletons/FormSkeleton'
import { useCreateArticle, useUpdateArticle, useArticle, useArticleCategories } from '../hooks/useArticles'
import type { CreateArticleInput, UpdateArticleInput } from '../types/article.types'
import {
  createArticleSchema,
  updateArticleSchema,
  type CreateArticleFormData,
  type UpdateArticleFormData,
} from '../schemas/article.schemas'
import { useTranslation } from '@/i18n/context'

interface ArticleFormProps {
  articleSlug?: string
}

export function ArticleForm({ articleSlug }: ArticleFormProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isEditMode = !!articleSlug

  const {
    data: articleData,
    isLoading: isLoadingArticle,
    isFetching: isFetchingArticle,
    dataUpdatedAt: articleDataUpdatedAt,
  } = useArticle(articleSlug || '')

  const { data: categoriesData } = useArticleCategories()

  const createArticle = useCreateArticle()
  const updateArticle = useUpdateArticle()

  const articleFormSchema = useMemo(() => {
    return isEditMode ? updateArticleSchema : createArticleSchema
  }, [isEditMode])

  type ArticleFormData = CreateArticleFormData | UpdateArticleFormData

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: '',
      category: '',
      excerpt: '',
      body: '',
      image_url: '',
      status: 'draft',
    },
  })

  const lastPopulatedRef = useRef<{ articleSlug: string; timestamp: number } | null>(null)
  const [bodyEditorKey, setBodyEditorKey] = useState(0)

  useEffect(() => {
    if (!isEditMode || !articleSlug) {
      lastPopulatedRef.current = null
      return
    }

    if (isLoadingArticle || isFetchingArticle || !articleData?.data) return

    const shouldPopulate =
      lastPopulatedRef.current === null ||
      lastPopulatedRef.current.articleSlug !== articleSlug ||
      articleDataUpdatedAt > lastPopulatedRef.current.timestamp

    if (!shouldPopulate) return

    const article = articleData.data

    reset(
      {
        title: article.title || '',
        category: article.category || '',
        excerpt: article.excerpt || '',
        body: article.body || '',
        image_url: article.image_url || '',
        status: (article.status as 'draft' | 'published') || 'draft',
      },
      { keepDefaultValues: false }
    )

    lastPopulatedRef.current = {
      articleSlug,
      timestamp: articleDataUpdatedAt,
    }
    setBodyEditorKey((k) => k + 1)
  }, [isEditMode, articleSlug, articleData, isLoadingArticle, isFetchingArticle, articleDataUpdatedAt, reset])

  const onSubmit = async (data: ArticleFormData) => {
    if (isEditMode && articleSlug) {
      const formData = data as UpdateArticleFormData
      const updateData: UpdateArticleInput = {
        title: formData.title || undefined,
        category: formData.category?.trim() || null,
        excerpt: formData.excerpt?.trim() || null,
        body: formData.body || undefined,
        image_url: formData.image_url?.trim() || null,
        status: formData.status,
      }
      updateArticle.mutate({ slug: articleSlug, data: updateData })
    } else {
      const formData = data as CreateArticleFormData
      const createData: CreateArticleInput = {
        title: formData.title,
        category: formData.category?.trim() || null,
        excerpt: formData.excerpt?.trim() || null,
        body: formData.body,
        image_url: formData.image_url?.trim() || null,
        status: formData.status,
      }
      createArticle.mutate(createData)
    }
  }

  if (isEditMode && isLoadingArticle) {
    return <FormSkeleton fieldsPerColumn={4} showActions={true} titleWidth="w-32" />
  }

  const categories = categoriesData?.data || {}

  return (
    <form
      key={isEditMode ? `article-form-${articleSlug}` : 'article-form-create'}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Left card: title, category, summary, status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-md lg:col-span-2">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  {t('article.form.title')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder={t('article.form.enterTitle')}
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">{t('article.form.category')}</Label>
                  <Select
                    value={watch('category') || ''}
                    onValueChange={(value) => setValue('category', value === '__none__' ? '' : value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('article.form.selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">— {t('article.form.noCategory')} —</SelectItem>
                      {Object.entries(categories).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">{t('article.form.status')}</Label>
                  <Select
                    value={watch('status') || 'draft'}
                    onValueChange={(value: 'draft' | 'published') => setValue('status', value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">{t('article.status.draft')}</SelectItem>
                      <SelectItem value="published">{t('article.status.published')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{t('article.form.statusHint')}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">{t('article.form.excerpt')}</Label>
                <Textarea
                  id="excerpt"
                  {...register('excerpt')}
                  placeholder={t('article.form.enterExcerpt')}
                  disabled={isSubmitting}
                  rows={4}
                />
                {errors.excerpt && (
                  <p className="text-sm text-destructive">{errors.excerpt.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right card: image */}
        <Card className="shadow-md lg:col-span-1">
          <CardContent className="pt-6">
            <ImageUpload
              label={t('article.form.image')}
              value={watch('image_url') || ''}
              onChange={(url: string | null) => setValue('image_url', url || '')}
            />
          </CardContent>
        </Card>
      </div>

      {/* Content: full width, increased height */}
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label>
              {t('article.form.body')} <span className="text-destructive">*</span>
            </Label>
            <SummernoteEditor
              key={isEditMode ? `body-${bodyEditorKey}` : 'body-create'}
              value={watch('body') || ''}
              onChange={(val) => setValue('body', val)}
              height={500}
            />
            {errors.body && (
              <p className="text-sm text-destructive">{errors.body.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/articles')}
              disabled={isSubmitting || createArticle.isPending || updateArticle.isPending}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('article.actions.cancel')}
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting || createArticle.isPending || updateArticle.isPending}
            >
              {(isSubmitting || createArticle.isPending || updateArticle.isPending) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditMode ? t('article.messages.updating') : t('article.messages.creating')}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {isEditMode ? t('article.actions.update') : t('article.actions.create')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
