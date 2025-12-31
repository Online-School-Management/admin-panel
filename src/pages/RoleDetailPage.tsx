import { useParams } from 'react-router-dom'
import { AdminLayout } from '@/layouts/AdminLayout'
import { RoleDetail } from '@/features/roles/components/RoleDetail'
import { PageHeader } from '@/components/common/PageHeader'

/**
 * Role Detail Page - Read-only detail view
 */
function RoleDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Role Details"
          description="View detailed information about a role and its permissions"
          backTo="/roles"
        />
        {id && <RoleDetail />}
      </div>
    </AdminLayout>
  )
}

export default RoleDetailPage

