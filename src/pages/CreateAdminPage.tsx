import { AdminLayout } from '@/layouts/AdminLayout'
import { AdminForm } from '@/features/admins/components/AdminForm'
import { PageHeader } from '@/components/common/PageHeader'

/**
 * Create Admin Page - Form to create a new admin
 */
function CreateAdminPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Create Admin"
          description="Add a new administrator to the system"
          backTo="/admins"
        />
        <AdminForm />
      </div>
    </AdminLayout>
  )
}

export default CreateAdminPage

