import { useParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { UserForm } from '@/features/users/components/UserForm'

/**
 * Edit User Page
 */
function EditUserPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit User"
        description="Update user information"
        backTo="/users"
        backLabel="Back to Users"
      />
      {id ? <UserForm userId={id} /> : <p>User ID not found</p>}
    </div>
  )
}

export default EditUserPage

