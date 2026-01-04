import { EnrollmentForm } from '@/features/enrollments/components/EnrollmentForm'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Create Enrollment Page - Form to create a new enrollment
 */
function CreateEnrollmentPage() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('enrollment.pages.create')}
        description={t('enrollment.descriptions.create')}
        backTo="/enrollments"
      />
      <EnrollmentForm />
    </div>
  )
}

export default CreateEnrollmentPage

