import { ArticlesList } from '@/features/articles/components/ArticlesList'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

function ArticlesListPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('article.pages.list')}
        description={t('article.descriptions.list')}
        addTo="/articles/new"
        addLabel={t('article.actions.create')}
      />
      <ArticlesList />
    </div>
  )
}

export default ArticlesListPage
