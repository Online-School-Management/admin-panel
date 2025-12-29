import { AdminLayout } from '@/layouts/AdminLayout'
import { RoleDetail } from '@/features/roles/components/RoleDetail'

/**
 * Role Detail Page - Read-only detail view
 */
function RoleDetailPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Role Details</h1>
          <p className="text-muted-foreground">
            View detailed information about a role and its permissions
          </p>
        </div>
        <RoleDetail />
      </div>
    </AdminLayout>
  )
}

export default RoleDetailPage

