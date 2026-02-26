import { useParams } from 'react-router-dom'
import { ArticleDetail } from '@/features/articles/components/ArticleDetail'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

function ArticleDetailPage() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('article.pages.detail')}
        description={t('article.descriptions.detail')}
        backTo="/articles"
        editTo={slug ? `/articles/${slug}/edit` : undefined}
        editLabel={t('article.actions.edit')}
      />
      {slug && <ArticleDetail articleSlug={slug} />}
    </div>
  )
}

export default ArticleDetailPage
