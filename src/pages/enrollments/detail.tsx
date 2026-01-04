import { useParams } from 'react-router-dom'
import { EnrollmentDetail } from '@/features/enrollments/components/EnrollmentDetail'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Enrollment Detail Page - Displays detailed information about an enrollment
 */
function EnrollmentDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const enrollmentId = id ? Number(id) : 0
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('enrollment.pages.detail')}
        description={t('enrollment.descriptions.detail')}
        backTo="/enrollments"
        editTo={id ? `/enrollments/${id}/edit` : undefined}
        editLabel={t('enrollment.actions.edit')}
      />
      {enrollmentId > 0 && <EnrollmentDetail enrollmentId={enrollmentId} />}
    </div>
  )
}

export default EnrollmentDetailPage

