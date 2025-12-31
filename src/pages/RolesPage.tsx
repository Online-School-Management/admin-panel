import { RolesList } from '@/features/roles/components/RolesList'
import { PageHeader } from '@/components/common/PageHeader'

/**
 * Roles Page - Read-only list view
 */
function RolesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles"
        description="View all roles and their assigned permissions"
      />
      <RolesList />
    </div>
  )
}

export default RolesPage

