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

interface DeleteStudentPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  paymentId: number
  isLoading?: boolean
}

/**
 * DeleteStudentPaymentDialog component - confirmation dialog for deleting a student payment
 */
export function DeleteStudentPaymentDialog({
  open,
  onOpenChange,
  onConfirm,
  paymentId,
  isLoading = false,
}: DeleteStudentPaymentDialogProps) {
  const { t } = useTranslation()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('studentPayment.dialog.deleteTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('studentPayment.dialog.deleteDescription', { id: paymentId })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t('studentPayment.actions.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? t('studentPayment.messages.deleting') : t('studentPayment.actions.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}


