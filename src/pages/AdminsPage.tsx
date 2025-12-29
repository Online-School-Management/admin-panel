import { AdminLayout } from '@/layouts/AdminLayout'
import { AdminsList } from '@/features/admins/components/AdminsList'
import { PageHeader } from '@/components/common/PageHeader'

/**
 * Admins Page - Displays a list of all admins
 */
function AdminsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Admins Management"
          description="View and manage system administrators."
        />
        <AdminsList />
      </div>
    </AdminLayout>
  )
}

export default AdminsPage

