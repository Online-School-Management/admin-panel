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

interface DeleteStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  studentName: string
  isLoading?: boolean
}

/**
 * DeleteStudentDialog component - confirms student deletion
 */
export function DeleteStudentDialog({
  open,
  onOpenChange,
  onConfirm,
  studentName,
  isLoading = false,
}: DeleteStudentDialogProps) {
  const { t } = useTranslation()
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('student.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('student.delete.description')}{' '}
            <strong>{studentName}</strong> {t('student.delete.andAllData')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{t('student.delete.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? t('student.delete.deleting') : t('student.delete.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}



