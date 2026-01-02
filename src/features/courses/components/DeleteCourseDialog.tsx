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

interface DeleteCourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  courseTitle: string
  isLoading?: boolean
}

/**
 * DeleteCourseDialog component - confirms course deletion
 */
export function DeleteCourseDialog({
  open,
  onOpenChange,
  onConfirm,
  courseTitle,
  isLoading = false,
}: DeleteCourseDialogProps) {
  const { t } = useTranslation()
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('course.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('course.delete.description')}{' '}
            <strong>{courseTitle}</strong> {t('course.delete.andAllData')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{t('course.delete.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? t('course.delete.deleting') : t('course.delete.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

