import { useParams } from 'react-router-dom'
import { ArticleForm } from '@/features/articles/components/ArticleForm'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

function EditArticlePage() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('article.pages.edit')}
        description={t('article.descriptions.edit')}
        backTo={slug ? `/articles/${slug}` : '/articles'}
      />
      <ArticleForm articleSlug={slug} />
    </div>
  )
}

export default EditArticlePage
