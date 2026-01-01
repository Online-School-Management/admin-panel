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

interface DeleteTeacherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  teacherName: string
  isLoading?: boolean
}

/**
 * DeleteTeacherDialog component - confirms teacher deletion
 */
export function DeleteTeacherDialog({
  open,
  onOpenChange,
  onConfirm,
  teacherName,
  isLoading = false,
}: DeleteTeacherDialogProps) {
  const { t } = useTranslation()
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('teacher.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('teacher.delete.description')}{' '}
            <strong>{teacherName}</strong> {t('teacher.delete.andAllData')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{t('teacher.delete.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? t('teacher.delete.deleting') : t('teacher.delete.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

