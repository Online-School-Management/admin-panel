import { FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DetailSkeleton } from '@/components/common/skeletons/DetailSkeleton'
import { useArticle, useArticleCategories } from '../hooks/useArticles'
import format from 'date-fns/format'
import type { Article } from '../types/article.types'
import { useTranslation } from '@/i18n/context'

interface ArticleDetailProps {
  articleSlug: string
}

export function ArticleDetail({ articleSlug }: ArticleDetailProps) {
  const { t } = useTranslation()
  const { data: articleData, isLoading, error } = useArticle(articleSlug)
  const { data: categoriesData } = useArticleCategories()

  if (isLoading) {
    return <DetailSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            {t('article.detail.errorLoading')}: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!articleData?.data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{t('article.messages.articleNotFound')}</p>
        </CardContent>
      </Card>
    )
  }

  const article: Article = articleData.data
  const categories = categoriesData?.data || {}
  const isPublished = article.status === 'published'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('article.detail.basicInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('article.detail.title')}</p>
                  <p className="text-base font-semibold">{article.title}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('article.detail.slug')}</p>
                  <code className="text-sm bg-muted px-2 py-1 rounded">{article.slug}</code>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('article.detail.category')}</p>
                  {article.category ? (
                    <Badge variant="secondary">
                      {categories[article.category] || article.category}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('article.detail.status')}</p>
                  <Badge variant={isPublished ? 'default' : 'outline'}>
                    {isPublished ? t('article.status.published') : t('article.status.draft')}
                  </Badge>
                </div>
                {article.excerpt && (
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">{t('article.detail.excerpt')}</p>
                    <p className="text-base">{article.excerpt}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Body / Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('article.detail.body')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: article.body }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Image */}
          {article.image_url && (
            <Card>
              <CardContent className="pt-6">
                <div className="w-full max-h-64 overflow-hidden rounded-md">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>{t('article.detail.timestamps')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {article.published_at && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('article.detail.publishedAt')}</p>
                  <p className="text-sm">
                    {format(new Date(article.published_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t('article.detail.created')}</p>
                <p className="text-sm">
                  {article.created_at
                    ? format(new Date(article.created_at), 'MMM dd, yyyy HH:mm')
                    : '-'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t('article.detail.updated')}</p>
                <p className="text-sm">
                  {article.updated_at
                    ? format(new Date(article.updated_at), 'MMM dd, yyyy HH:mm')
                    : '-'}
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
