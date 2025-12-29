import { AdminLayout } from '@/layouts/AdminLayout'
import { PermissionsList } from '@/features/permissions/components/PermissionsList'

/**
 * Permissions Page - Read-only list view
 */
function PermissionsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
          <p className="text-muted-foreground">
            View all available permissions in the system
          </p>
        </div>
        <PermissionsList />
      </div>
    </AdminLayout>
  )
}

export default PermissionsPage

