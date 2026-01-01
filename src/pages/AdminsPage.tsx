import { AdminsList } from '@/features/admins/components/AdminsList'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Admins Page - Displays a list of all admins
 */
function AdminsPage() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.pages.list')}
        description={t('admin.descriptions.list')}
        addTo="/admins/new"
        addLabel={t('admin.actions.create')}
      />
      <AdminsList />
    </div>
  )
}

export default AdminsPage

