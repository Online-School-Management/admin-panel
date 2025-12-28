import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout } from '@/layouts/AdminLayout'
import { Button } from '@/components/ui/button'
import { UserForm } from '@/features/users/components/UserForm'

/**
 * Edit User Page
 */
function EditUserPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with title and back button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
            <p className="text-muted-foreground mt-1">
              Update user information
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/users">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Link>
          </Button>
        </div>
        {id ? <UserForm userId={id} /> : <p>User ID not found</p>}
      </div>
    </AdminLayout>
  )
}

export default EditUserPage

