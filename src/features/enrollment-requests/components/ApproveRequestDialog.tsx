import { useState } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useApproveEnrollmentRequest } from '../hooks/useEnrollmentRequests'
import type { EnrollmentRequestCollectionItem } from '../types/enrollment-request.types'

interface ApproveRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: EnrollmentRequestCollectionItem | null
}

export function ApproveRequestDialog({ open, onOpenChange, request }: ApproveRequestDialogProps) {
  const approve = useApproveEnrollmentRequest()
  const [firstNMonthsFree, setFirstNMonthsFree] = useState(0)
  const [discountType, setDiscountType] = useState<string>('none')
  const [discountValue, setDiscountValue] = useState<string>('')

  const isLoading = approve.isPending

  const handleApprove = () => {
    if (!request) return
    approve.mutate(
      {
        id: request.id,
        data: {
          first_n_months_free: firstNMonthsFree > 0 ? firstNMonthsFree : undefined,
          discount_type:
            discountType !== 'none' ? (discountType as 'percentage' | 'fixed') : null,
          discount_value:
            discountType !== 'none' && discountValue ? Number(discountValue) : null,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          setFirstNMonthsFree(0)
          setDiscountType('none')
          setDiscountValue('')
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Approve Enrollment Request</DialogTitle>
          <DialogDescription>
            Approve request from{' '}
            <strong>{request?.name_en}</strong> for{' '}
            <strong>{request?.course?.title}</strong>. This will create an enrollment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Free months (optional)</Label>
            <Input
              type="number"
              min={0}
              max={24}
              value={firstNMonthsFree}
              onChange={(e) => setFirstNMonthsFree(Number(e.target.value))}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Discount (optional)</Label>
            <Select value={discountType} onValueChange={setDiscountType} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {discountType !== 'none' && (
            <div className="space-y-2">
              <Label>
                {discountType === 'percentage' ? 'Discount (%)' : 'Discount (amount)'}
              </Label>
              <Input
                type="number"
                min={0}
                step={discountType === 'percentage' ? 1 : 0.01}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleApprove} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
