import { useParams } from 'react-router-dom'
import { SubjectForm } from '@/features/subjects/components/SubjectForm'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Edit Subject Page - Form to edit an existing subject
 */
function EditSubjectPage() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('subject.pages.edit')}
        description={t('subject.descriptions.edit')}
        backTo={slug ? `/subjects/${slug}` : '/subjects'}
      />
      <SubjectForm subjectSlug={slug} />
    </div>
  )
}

export default EditSubjectPage



