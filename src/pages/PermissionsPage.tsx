import { AdminLayout } from '@/layouts/AdminLayout'
import { PermissionsList } from '@/features/permissions/components/PermissionsList'
import { PageHeader } from '@/components/common/PageHeader'

/**
 * Permissions Page - Read-only list view
 */
function PermissionsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Permissions"
          description="View all available permissions in the system"
        />
        <PermissionsList />
      </div>
    </AdminLayout>
  )
}

export default PermissionsPage

