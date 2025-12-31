import { useParams } from 'react-router-dom'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AdminDetail } from '@/features/admins/components/AdminDetail'
import { PageHeader } from '@/components/common/PageHeader'

/**
 * Admin Detail Page - Displays detailed information about an admin
 */
function AdminDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Admin Details"
          description="View detailed information about the administrator"
          backTo="/admins"
          editTo={id ? `/admins/${id}/edit` : undefined}
          editLabel="Edit Admin"
        />
        {id && <AdminDetail adminId={id} />}
      </div>
    </AdminLayout>
  )
}

export default AdminDetailPage

