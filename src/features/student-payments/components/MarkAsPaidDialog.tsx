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

interface MarkAsPaidDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  studentName?: string
  isLoading?: boolean
}

/**
 * MarkAsPaidDialog component - confirmation dialog for marking a payment as paid
 */
export function MarkAsPaidDialog({
  open,
  onOpenChange,
  onConfirm,
  studentName,
  isLoading = false,
}: MarkAsPaidDialogProps) {
  const { t } = useTranslation()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('studentPayment.dialog.markAsPaidTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {studentName ? (
              <>
                {t('studentPayment.dialog.markAsPaidDescription')}{' '}
                <strong>{studentName}</strong>{' '}
                {t('studentPayment.dialog.markAsPaidDescriptionEnd')}
              </>
            ) : (
              t('studentPayment.dialog.markAsPaidDescriptionDefault')
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t('studentPayment.actions.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? t('studentPayment.messages.markingAsPaid') : t('studentPayment.actions.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}



