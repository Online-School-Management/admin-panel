import { useParams } from 'react-router-dom'
import { SubjectDetail } from '@/features/subjects/components/SubjectDetail'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Subject Detail Page - Displays detailed information about a subject
 */
function SubjectDetailPage() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('subject.pages.detail')}
        description={t('subject.descriptions.detail')}
        backTo="/subjects"
        editTo={slug ? `/subjects/${slug}/edit` : undefined}
        editLabel={t('subject.actions.edit')}
      />
      {slug && <SubjectDetail subjectSlug={slug} />}
    </div>
  )
}

export default SubjectDetailPage



