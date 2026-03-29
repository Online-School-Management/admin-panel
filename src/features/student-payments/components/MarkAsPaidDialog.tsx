import { useState, useEffect, useMemo } from 'react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { useTranslation } from '@/i18n/context'
import { useStudentPaymentsByEnrollment, useMarkPaidBulk } from '../hooks/useStudentPayments'
import { formatCurrency } from '@/utils/format'
import format from 'date-fns/format'
import { CalendarPlus, ArrowLeft, Loader2 } from 'lucide-react'
interface PaymentForDialog {
  id: number
  enrollment_id: number
  status: string
  /** Used to show fee month in the label (e.g. Jan 2026). */
  due_date?: string | null
}

function formatFeeMonthLabel(dueDate: string | null | undefined): string {
  if (!dueDate) return ''
  try {
    return format(new Date(dueDate), 'MMM yyyy')
  } catch {
    return ''
  }
}

interface MarkAsPaidDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (paymentDate: string) => void
  studentName?: string
  isLoading?: boolean
  payment?: PaymentForDialog | null
}

export function MarkAsPaidDialog({
  open,
  onOpenChange,
  onConfirm,
  studentName,
  isLoading = false,
  payment,
}: MarkAsPaidDialogProps) {
  const { t } = useTranslation()
  const today = new Date().toISOString().split('T')[0]
  const [paymentDate, setPaymentDate] = useState(today)
  const [prePaymentMode, setPrePaymentMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const enrollmentId = payment?.enrollment_id ?? 0

  const { data: enrollmentPayments, isLoading: loadingEnrollment } = useStudentPaymentsByEnrollment(
    prePaymentMode ? enrollmentId : 0
  )

  const markBulk = useMarkPaidBulk()

  const pendingPayments = useMemo(() => {
    if (!enrollmentPayments?.data) return []
    return enrollmentPayments.data.filter((p) => p.status === 'pending')
  }, [enrollmentPayments])

  const selectedTotal = useMemo(() => {
    return pendingPayments
      .filter((p) => selectedIds.includes(p.id))
      .reduce((sum, p) => sum + (p.amount_paid || 0), 0)
  }, [pendingPayments, selectedIds])

  useEffect(() => {
    if (open) {
      setPaymentDate(new Date().toISOString().split('T')[0])
      setPrePaymentMode(false)
      setSelectedIds([])
    }
  }, [open])

  useEffect(() => {
    if (prePaymentMode && payment) {
      setSelectedIds([payment.id])
    }
  }, [prePaymentMode, payment])

  const handleConfirm = () => {
    onConfirm(paymentDate || new Date().toISOString().split('T')[0])
  }

  const handleBulkConfirm = () => {
    if (selectedIds.length === 0) return
    markBulk.mutate(
      { payment_ids: selectedIds, payment_date: paymentDate || today },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  const togglePayment = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedIds.length === pendingPayments.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(pendingPayments.map((p) => p.id))
    }
  }

  const bulkLoading = markBulk.isPending

  const feeMonthLabel = formatFeeMonthLabel(payment?.due_date)
  const paymentDateFieldLabel = prePaymentMode
    ? t('studentPayment.dialog.paymentDateBulk')
    : feeMonthLabel
      ? t('studentPayment.dialog.paymentDateForFeeMonth', { month: feeMonthLabel })
      : t('studentPayment.dialog.paymentDateFallback')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {!prePaymentMode ? (
          <>
            <DialogHeader>
              <DialogTitle>{t('studentPayment.dialog.markAsPaidTitle')}</DialogTitle>
              <DialogDescription>
                {studentName ? (
                  <>
                    {t('studentPayment.dialog.markAsPaidDescription')}{' '}
                    <strong>{studentName}</strong>{' '}
                    {t('studentPayment.dialog.markAsPaidDescriptionEnd')}
                  </>
                ) : (
                  t('studentPayment.dialog.markAsPaidDescriptionDefault')
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="py-2">
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                {paymentDateFieldLabel}
              </label>
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full sm:w-auto"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('studentPayment.dialog.paymentDateHint')}
              </p>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              {payment && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPrePaymentMode(true)}
                  className="gap-2"
                >
                  <CalendarPlus className="h-4 w-4" />
                  {t('studentPayment.dialog.prePayment')}
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                  className="border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
                >
                  {t('studentPayment.actions.cancel')}
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? t('studentPayment.messages.markingAsPaid') : t('studentPayment.actions.confirm')}
                </Button>
              </div>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t('studentPayment.dialog.prePaymentTitle')}</DialogTitle>
              <DialogDescription>
                {t('studentPayment.dialog.prePaymentDescription')}
              </DialogDescription>
            </DialogHeader>

            <div className="py-2 space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  {paymentDateFieldLabel}
                </label>
                <Input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full sm:w-auto"
                />
              </div>

              {loadingEnrollment ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : pendingPayments.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  {t('studentPayment.dialog.noMorePendingMonths')}
                </p>
              ) : (
                <>
                  <div className="flex items-center gap-2 pb-1 border-b">
                    <Checkbox
                      checked={selectedIds.length === pendingPayments.length}
                      onCheckedChange={toggleAll}
                      id="select-all"
                    />
                    <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                      {t('studentPayment.dialog.selectedMonths', { count: selectedIds.length })}
                    </label>
                  </div>

                  <div className="max-h-[240px] overflow-y-auto space-y-1">
                    {pendingPayments.map((p) => (
                      <label
                        key={p.id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedIds.includes(p.id)}
                          onCheckedChange={() => togglePayment(p.id)}
                        />
                        <div className="flex-1 flex justify-between items-center">
                          <span className="text-sm">
                            {t('studentPayment.monthNumber', { number: p.month_number })}
                            {' — '}
                            {p.due_date ? format(new Date(p.due_date), 'MMM yyyy') : '-'}
                          </span>
                          <span className="text-sm font-medium">
                            {formatCurrency(p.amount_paid || 0)}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {selectedIds.length > 0 && (
                    <div className="flex justify-between items-center pt-2 border-t font-medium">
                      <span className="text-sm">{t('studentPayment.dialog.totalAmount')}</span>
                      <span className="text-base">{formatCurrency(selectedTotal)}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setPrePaymentMode(false)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('studentPayment.dialog.backToSingle')}
              </Button>
              <div className="flex gap-2 ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={bulkLoading}
                  className="border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
                >
                  {t('studentPayment.actions.cancel')}
                </Button>
                <Button
                  type="button"
                  onClick={handleBulkConfirm}
                  disabled={bulkLoading || selectedIds.length === 0}
                >
                  {bulkLoading
                    ? t('studentPayment.messages.markingAsPaid')
                    : t('studentPayment.dialog.confirmBulk', { count: selectedIds.length })}
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
