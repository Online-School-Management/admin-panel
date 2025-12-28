import { Link } from 'react-router-dom'
import { ArrowLeft, UserPlus } from 'lucide-react'
import { AdminLayout } from '@/layouts/AdminLayout'
import { Button } from '@/components/ui/button'
import { UserForm } from '@/features/users/components/UserForm'

/**
 * Create User Page
 */
function CreateUserPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with title and back button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Create User</h1>
            <p className="text-muted-foreground mt-1">
              Create a new individual or company user
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/users">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Link>
          </Button>
        </div>
        <UserForm />
      </div>
    </AdminLayout>
  )
}

export default CreateUserPage
