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

interface DeleteSubjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  subjectName: string
  isLoading?: boolean
}

/**
 * DeleteSubjectDialog component - confirms subject deletion
 */
export function DeleteSubjectDialog({
  open,
  onOpenChange,
  onConfirm,
  subjectName,
  isLoading = false,
}: DeleteSubjectDialogProps) {
  const { t } = useTranslation()
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('subject.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('subject.delete.description')}{' '}
            <strong>{subjectName}</strong> {t('subject.delete.andAllData')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{t('subject.delete.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? t('subject.delete.deleting') : t('subject.delete.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

