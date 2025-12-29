import { AdminLayout } from '@/layouts/AdminLayout'
import { RolesList } from '@/features/roles/components/RolesList'

/**
 * Roles Page - Read-only list view
 */
function RolesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
          <p className="text-muted-foreground">
            View all roles and their assigned permissions
          </p>
        </div>
        <RolesList />
      </div>
    </AdminLayout>
  )
}

export default RolesPage

