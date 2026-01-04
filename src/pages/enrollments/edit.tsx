import { useParams } from 'react-router-dom'
import { EnrollmentForm } from '@/features/enrollments/components/EnrollmentForm'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Edit Enrollment Page - Form to edit an existing enrollment
 */
function EditEnrollmentPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const enrollmentId = id ? Number(id) : undefined
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('enrollment.pages.edit')}
        description={t('enrollment.descriptions.edit')}
        backTo={id ? `/enrollments/${id}` : '/enrollments'}
      />
      {enrollmentId && <EnrollmentForm enrollmentId={enrollmentId} />}
    </div>
  )
}

export default EditEnrollmentPage

