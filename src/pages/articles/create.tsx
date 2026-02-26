import { ArticleForm } from '@/features/articles/components/ArticleForm'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

function CreateArticlePage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('article.pages.create')}
        description={t('article.descriptions.create')}
        backTo="/articles"
      />
      <ArticleForm />
    </div>
  )
}

export default CreateArticlePage
