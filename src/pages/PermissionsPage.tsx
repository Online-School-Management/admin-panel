import { PermissionsList } from '@/features/permissions/components/PermissionsList'
import { PageHeader } from '@/components/common/PageHeader'


/**
 * Permissions Page - Read-only list view
 */
function PermissionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
          title="Permission List"
          description="View and manage system administrators"
        />
      <PermissionsList />
    </div>
  )
}

export default PermissionsPage

