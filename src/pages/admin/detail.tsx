import { useParams } from 'react-router-dom'
import { AdminDetail } from '@/features/admins/components/AdminDetail'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Admin Detail Page - Displays detailed information about an admin
 */
function AdminDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.pages.detail')}
        description={t('admin.descriptions.detail')}
        backTo="/admins"
        editTo={id ? `/admins/${id}/edit` : undefined}
        editLabel={t('admin.actions.edit')}
      />
      {id && <AdminDetail adminId={id} />}
    </div>
  )
}

export default AdminDetailPage

