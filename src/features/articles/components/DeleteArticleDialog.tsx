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

interface DeleteArticleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  articleTitle: string
  isLoading?: boolean
}

export function DeleteArticleDialog({
  open,
  onOpenChange,
  onConfirm,
  articleTitle,
  isLoading = false,
}: DeleteArticleDialogProps) {
  const { t } = useTranslation()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('article.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('article.delete.description')}{' '}
            <strong>{articleTitle}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{t('article.delete.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? t('article.delete.deleting') : t('article.delete.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
