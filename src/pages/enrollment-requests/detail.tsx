import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EnrollmentRequestDetail } from '@/features/enrollment-requests/components/EnrollmentRequestDetail'
import { ApproveRequestDialog } from '@/features/enrollment-requests/components/ApproveRequestDialog'
import { RejectRequestDialog } from '@/features/enrollment-requests/components/RejectRequestDialog'
import { useEnrollmentRequest } from '@/features/enrollment-requests/hooks/useEnrollmentRequests'
import { PageHeader } from '@/components/common/PageHeader'

function EnrollmentRequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const requestId = id ? Number(id) : 0
  const { data } = useEnrollmentRequest(requestId)
  const req = data?.data

  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)

  const isPending = req?.status === 'pending'

  const collectionItem = req
    ? {
        id: req.id,
        status: req.status,
        name_en: req.name_en,
        phone: req.phone,
        class_interest: req.class_interest,
        user: req.user ? { id: req.user.id, name: req.user.name, email: req.user.email } : null,
        course: req.course
          ? { id: req.course.id, slug: req.course.slug, title: req.course.title }
          : null,
        approved_at: req.approved_at,
        rejected_at: req.rejected_at,
        created_at: req.created_at,
      }
    : null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enrollment Request Details"
        description="Review detailed information about this enrollment request"
        backTo="/enrollment-requests"
        action={
          isPending ? (
            <div className="flex gap-2">
              <Button onClick={() => setApproveOpen(true)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button variant="destructive" onClick={() => setRejectOpen(true)}>
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          ) : undefined
        }
      />
      {requestId > 0 && <EnrollmentRequestDetail requestId={requestId} />}

      <ApproveRequestDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        request={collectionItem}
      />
      <RejectRequestDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        request={collectionItem}
      />
    </div>
  )
}

export default EnrollmentRequestDetailPage
