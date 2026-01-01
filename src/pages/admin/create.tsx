import { AdminForm } from '@/features/admins/components/AdminForm'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Create Admin Page - Form to create a new admin
 */
function CreateAdminPage() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.pages.create')}
        description={t('admin.descriptions.create')}
        backTo="/admins"
      />
      <AdminForm />
    </div>
  )
}

export default CreateAdminPage

