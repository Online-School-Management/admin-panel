import format from 'date-fns/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useEnrollmentRequest } from '../hooks/useEnrollmentRequests'

interface EnrollmentRequestDetailProps {
  requestId: number
}

export function EnrollmentRequestDetail({ requestId }: EnrollmentRequestDetailProps) {
  const { data, isLoading, error } = useEnrollmentRequest(requestId)
  const req = data?.data

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-1/3 rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !req) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            {error ? (error as Error).message : 'Enrollment request not found.'}
          </p>
        </CardContent>
      </Card>
    )
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary' as const
      case 'approved':
        return 'default' as const
      case 'rejected':
        return 'destructive' as const
      default:
        return 'secondary' as const
    }
  }

  const formatDate = (d: string | null) =>
    d ? format(new Date(d), 'MMM dd, yyyy HH:mm') : '—'

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Request Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Status</dt>
              <dd className="mt-1">
                <Badge variant={getStatusVariant(req.status)}>
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Submitted</dt>
              <dd className="mt-1 text-sm">{formatDate(req.created_at)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Name (English)</dt>
              <dd className="mt-1 text-sm">{req.name_en}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Age</dt>
              <dd className="mt-1 text-sm">{req.age ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Education</dt>
              <dd className="mt-1 text-sm">{req.education ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">School Type</dt>
              <dd className="mt-1 text-sm capitalize">
                {req.school_type}
                {req.school_other ? ` — ${req.school_other}` : ''}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
              <dd className="mt-1 text-sm">{req.phone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Facebook</dt>
              <dd className="mt-1 text-sm">{req.facebook_account ?? '—'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">Town / Address</dt>
              <dd className="mt-1 text-sm">{req.town_address ?? '—'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="mt-0.5 text-sm">{req.user?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="mt-0.5 text-sm">{req.user?.email ?? '—'}</dd>
              </div>
              {req.user?.student && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Student ID</dt>
                  <dd className="mt-0.5 text-sm">{req.user.student.student_id}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Course</dt>
                <dd className="mt-0.5 text-sm">{req.course?.title ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Subject</dt>
                <dd className="mt-0.5 text-sm">{req.course?.subject?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Course Status</dt>
                <dd className="mt-0.5 text-sm capitalize">{req.course?.status ?? '—'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {(req.approved_by || req.rejected_by) && (
        <Card>
          <CardHeader>
            <CardTitle>Review Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              {req.approved_by && (
                <>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Approved By</dt>
                    <dd className="mt-1 text-sm">{req.approved_by.name ?? req.approved_by.admin_id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Approved At</dt>
                    <dd className="mt-1 text-sm">{formatDate(req.approved_at)}</dd>
                  </div>
                </>
              )}
              {req.rejected_by && (
                <>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Rejected By</dt>
                    <dd className="mt-1 text-sm">{req.rejected_by.name ?? req.rejected_by.admin_id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Rejected At</dt>
                    <dd className="mt-1 text-sm">{formatDate(req.rejected_at)}</dd>
                  </div>
                  {req.rejection_reason && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-muted-foreground">Reason</dt>
                      <dd className="mt-1 text-sm">{req.rejection_reason}</dd>
                    </div>
                  )}
                </>
              )}
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
