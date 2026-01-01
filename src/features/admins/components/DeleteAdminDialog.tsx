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

interface DeleteAdminDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  adminName: string
  isLoading?: boolean
}

/**
 * DeleteAdminDialog component - confirms admin deletion
 */
export function DeleteAdminDialog({
  open,
  onOpenChange,
  onConfirm,
  adminName,
  isLoading = false,
}: DeleteAdminDialogProps) {
  const { t } = useTranslation()
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('admin.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('admin.delete.description')}{' '}
            <strong>{adminName}</strong> {t('admin.delete.andAllData')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{t('admin.delete.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? t('admin.delete.deleting') : t('admin.delete.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}



