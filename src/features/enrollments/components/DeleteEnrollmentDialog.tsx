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

interface DeleteEnrollmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  enrollmentInfo: string
  isLoading?: boolean
}

/**
 * DeleteEnrollmentDialog component - confirms enrollment deletion
 */
export function DeleteEnrollmentDialog({
  open,
  onOpenChange,
  onConfirm,
  enrollmentInfo,
  isLoading = false,
}: DeleteEnrollmentDialogProps) {
  const { t } = useTranslation()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('enrollment.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('enrollment.delete.description')}{' '}
            <strong>{enrollmentInfo}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{t('enrollment.delete.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? t('enrollment.delete.deleting') : t('enrollment.delete.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

