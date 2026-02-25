import { EnrollmentRequestsList } from '@/features/enrollment-requests/components/EnrollmentRequestsList'
import { PageHeader } from '@/components/common/PageHeader'

function EnrollmentRequestsListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Enrollment Requests"
        description="Review and process student enrollment requests"
      />
      <EnrollmentRequestsList />
    </div>
  )
}

export default EnrollmentRequestsListPage
