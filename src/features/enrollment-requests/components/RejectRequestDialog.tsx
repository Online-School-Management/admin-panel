import { useState } from 'react'
import { Loader2, XCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRejectEnrollmentRequest } from '../hooks/useEnrollmentRequests'
import type { EnrollmentRequestCollectionItem } from '../types/enrollment-request.types'

interface RejectRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: EnrollmentRequestCollectionItem | null
}

export function RejectRequestDialog({ open, onOpenChange, request }: RejectRequestDialogProps) {
  const reject = useRejectEnrollmentRequest()
  const [reason, setReason] = useState('')

  const isLoading = reject.isPending

  const handleReject = () => {
    if (!request || !reason.trim()) return
    reject.mutate(
      {
        id: request.id,
        data: { rejection_reason: reason.trim() },
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          setReason('')
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Enrollment Request</DialogTitle>
          <DialogDescription>
            Reject request from{' '}
            <strong>{request?.name_en}</strong> for{' '}
            <strong>{request?.course?.title}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>
            Rejection reason <span className="text-destructive">*</span>
          </Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a reason for rejection..."
            rows={3}
            disabled={isLoading}
          />
          {reason.length > 0 && reason.trim().length < 2 && (
            <p className="text-sm text-destructive">Reason must be at least 2 characters.</p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isLoading || reason.trim().length < 2}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Rejecting...
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
