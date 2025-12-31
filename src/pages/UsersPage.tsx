import { UsersList } from '@/features/users/components/UsersList'

/**
 * Users Page - Full CRUD implementation
 */
function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground">
          Manage users, roles, and permissions
        </p>
      </div>
      <UsersList />
    </div>
  )
}

export default UsersPage
