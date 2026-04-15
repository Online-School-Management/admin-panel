import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef } from 'react'
import { ArrowLeft, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/common/ImageUpload'
import { SummernoteEditor } from '@/components/common/SummernoteEditor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormSkeleton } from '@/components/common/skeletons/FormSkeleton'
import { useCreateSubject, useUpdateSubject, useSubject } from '../hooks/useSubjects'
import type { CreateSubjectInput, UpdateSubjectInput } from '../types/subject.types'
import { createSubjectSchema, updateSubjectSchema, type CreateSubjectFormData, type UpdateSubjectFormData } from '../schemas/subject.schemas'
import { useTranslation } from '@/i18n/context'

interface SubjectFormProps {
  subjectSlug?: string
}

/**
 * SubjectForm component - handles both create and edit
 */
export function SubjectForm({ subjectSlug }: SubjectFormProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isEditMode = !!subjectSlug

  const {
    data: subjectData,
    isLoading: isLoadingSubject,
    isFetching: isFetchingSubject,
    dataUpdatedAt: subjectDataUpdatedAt,
  } = useSubject(subjectSlug || '')

  const createSubject = useCreateSubject()
  const updateSubject = useUpdateSubject()

  const subjectFormSchema = useMemo(() => {
    return isEditMode ? updateSubjectSchema : createSubjectSchema
  }, [isEditMode])

  type SubjectFormData = CreateSubjectFormData | UpdateSubjectFormData

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      name: '',
      image_url: undefined,
      short_description: undefined,
      tag_en: undefined,
      tag_mm: undefined,
      description: undefined,
    },
  })

  const lastPopulatedRef = useRef<{ subjectSlug: string; timestamp: number } | null>(null)

  useEffect(() => {
    if (!isEditMode || !subjectSlug) {
      lastPopulatedRef.current = null
      return
    }

    if (isLoadingSubject || isFetchingSubject || !subjectData?.data) return

    const shouldPopulate =
      lastPopulatedRef.current === null ||
      lastPopulatedRef.current.subjectSlug !== subjectSlug ||
      subjectDataUpdatedAt > lastPopulatedRef.current.timestamp

    if (!shouldPopulate) return

    const subject = subjectData.data

    reset({
      name: subject.name || '',
      image_url: subject.image_url || undefined,
      short_description: subject.short_description || undefined,
      tag_en: subject.tag_en || undefined,
      tag_mm: subject.tag_mm || undefined,
      description: subject.description || undefined,
    }, {
      keepDefaultValues: false,
    })

    lastPopulatedRef.current = {
      subjectSlug,
      timestamp: subjectDataUpdatedAt,
    }
  }, [isEditMode, subjectSlug, subjectData, isLoadingSubject, isFetchingSubject, subjectDataUpdatedAt, reset])

  const onSubmit = async (data: SubjectFormData) => {
    if (isEditMode && subjectSlug) {
      const updateFormData = data as UpdateSubjectFormData
      const updateData: UpdateSubjectInput = {
        name: updateFormData.name || undefined,
        image_url: updateFormData.image_url ?? null,
        short_description: updateFormData.short_description ?? null,
        tag_en: updateFormData.tag_en ?? null,
        tag_mm: updateFormData.tag_mm ?? null,
        description: updateFormData.description ?? null,
      }
      updateSubject.mutate({ slug: subjectSlug, data: updateData })
    } else {
      const createFormData = data as CreateSubjectFormData
      const createData: CreateSubjectInput = {
        name: createFormData.name,
        image_url: createFormData.image_url ?? undefined,
        short_description: createFormData.short_description ?? undefined,
        tag_en: createFormData.tag_en ?? undefined,
        tag_mm: createFormData.tag_mm ?? undefined,
        description: createFormData.description ?? undefined,
      }
      createSubject.mutate(createData)
    }
  }

  if (isEditMode && isLoadingSubject) {
    return <FormSkeleton fieldsPerColumn={2} showActions={true} titleWidth="w-32" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? t('subject.pages.edit') : t('subject.pages.create')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          key={isEditMode ? `subject-form-${subjectSlug}` : 'subject-form-create'}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t('subject.form.name')}
                  {' '}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder={t('subject.form.enterName')}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag_en">{t('subject.form.tagEn')}</Label>
                <Input
                  id="tag_en"
                  {...register('tag_en')}
                  placeholder={t('subject.form.enterTagEn')}
                  disabled={isSubmitting}
                />
                {errors.tag_en && (
                  <p className="text-sm text-destructive">{errors.tag_en.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag_mm">{t('subject.form.tagMm')}</Label>
                <Input
                  id="tag_mm"
                  {...register('tag_mm')}
                  placeholder={t('subject.form.enterTagMm')}
                  disabled={isSubmitting}
                />
                {errors.tag_mm && (
                  <p className="text-sm text-destructive">{errors.tag_mm.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="short_description">{t('subject.form.shortDescription')}</Label>
                <Textarea
                  id="short_description"
                  {...register('short_description')}
                  placeholder={t('subject.form.enterShortDescription')}
                  disabled={isSubmitting}
                  rows={4}
                />
                {errors.short_description && (
                  <p className="text-sm text-destructive">{errors.short_description.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 border-t">
            <div className="md:col-span-3 space-y-2">
              <Label>{t('subject.form.image')}</Label>
              <ImageUpload
                value={watch('image_url') || null}
                onChange={(url) => setValue('image_url', url, { shouldValidate: true })}
                disabled={isSubmitting}
                label=""
              />
              {errors.image_url && (
                <p className="text-sm text-destructive">{errors.image_url.message}</p>
              )}
            </div>
            <div className="md:col-span-9 space-y-2">
              <Label>{t('subject.form.description')}</Label>
              <SummernoteEditor
                value={watch('description') || ''}
                onChange={(content) => setValue('description', content, { shouldValidate: true })}
                placeholder={t('subject.form.enterDescription')}
                height={250}
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/subjects')}
              disabled={isSubmitting || createSubject.isPending || updateSubject.isPending}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('subject.actions.cancel')}
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting || createSubject.isPending || updateSubject.isPending}
            >
              {(isSubmitting || createSubject.isPending || updateSubject.isPending) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditMode
                    ? t('subject.messages.updating')
                    : t('subject.messages.creating')}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {isEditMode
                    ? t('subject.actions.update')
                    : t('subject.actions.create')}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
