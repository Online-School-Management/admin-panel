import { useParams } from 'react-router-dom'
import { AdminForm } from '@/features/admins/components/AdminForm'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Edit Admin Page - Form to edit an existing admin
 */
function EditAdminPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.pages.edit')}
        description={t('admin.descriptions.edit')}
        backTo={id ? `/admins/${id}` : '/admins'}
      />
      <AdminForm adminId={id} />
    </div>
  )
}

export default EditAdminPage

