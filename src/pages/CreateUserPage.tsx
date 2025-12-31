import { PageHeader } from '@/components/common/PageHeader'
import { UserForm } from '@/features/users/components/UserForm'

/**
 * Create User Page
 */
function CreateUserPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create User"
        description="Create a new individual or company user"
        backTo="/users"
        backLabel="Back to Users"
      />
      <UserForm />
    </div>
  )
}

export default CreateUserPage
