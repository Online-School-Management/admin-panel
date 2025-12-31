import { useParams } from 'react-router-dom'
import { AdminForm } from '@/features/admins/components/AdminForm'
import { PageHeader } from '@/components/common/PageHeader'

/**
 * Edit Admin Page - Form to edit an existing admin
 */
function EditAdminPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Admin"
        description="Update administrator information"
        backTo={id ? `/admins/${id}` : '/admins'}
      />
      <AdminForm adminId={id} />
    </div>
  )
}

export default EditAdminPage

