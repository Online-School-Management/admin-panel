import { SubjectForm } from '@/features/subjects/components/SubjectForm'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Create Subject Page - Form to create a new subject
 */
function CreateSubjectPage() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('subject.pages.create')}
        description={t('subject.descriptions.create')}
        backTo="/subjects"
      />
      <SubjectForm />
    </div>
  )
}

export default CreateSubjectPage

