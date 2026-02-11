import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useTranslation } from '@/i18n/context'
import { formatCurrency } from '@/utils/format'

interface MarkPayoutAsPaidDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  teacherName?: string | null
  amount?: number
  isLoading?: boolean
  isBulk?: boolean
  bulkCount?: number
}

/**
 * MarkPayoutAsPaidDialog - confirmation dialog for marking payout(s) as paid
 */
export function MarkPayoutAsPaidDialog({
  open,
  onOpenChange,
  onConfirm,
  teacherName,
  amount,
  isLoading = false,
  isBulk = false,
  bulkCount = 0,
}: MarkPayoutAsPaidDialogProps) {
  const { t } = useTranslation()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isBulk
              ? t('teacherPayout.dialog.markBulkTitle')
              : t('teacherPayout.dialog.markPaidTitle')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBulk ? (
              t('teacherPayout.dialog.markBulkDescription', { count: String(bulkCount) })
            ) : (
              <>
                {t('teacherPayout.dialog.markPaidDescription')}{' '}
                {teacherName && <strong>{teacherName}</strong>}
                {amount != null && (
                  <>
                    {' — '}
                    <strong>{formatCurrency(amount)}</strong>
                  </>
                )}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t('teacherPayout.actions.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading
              ? t('teacherPayout.actions.processing')
              : t('teacherPayout.actions.confirmPaid')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
