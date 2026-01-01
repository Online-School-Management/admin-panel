/**
 * Role feature translations (English)
 */

export const role = {
  // Page titles
  pages: {
    list: 'Roles',
    detail: 'Role Details',
  },

  // Descriptions
  descriptions: {
    list: 'View all roles and their assigned permissions',
    detail: 'View detailed information about this role',
  },

  // Table headers
  table: {
    id: 'ID',
    name: 'Name',
    slug: 'Slug',
    description: 'Description',
    status: 'Status',
    permissions: 'Permissions',
    createdAt: 'Created At',
    actions: 'Actions',
  },

  // Filters
  filters: {
    allStatus: 'All Status',
    searchRoles: 'Search roles...',
    filterByStatus: 'Filter by status',
  },

  // Messages
  messages: {
    noRoles: 'No roles available',
    noRolesFound: 'No roles found matching your criteria',
    noPermissions: 'No permissions assigned to this role',
    allPermissions: 'All permissions assigned to this role',
    permissionsCount: (count: number) => `${count} permission${count !== 1 ? 's' : ''}`,
    showingRoles: (count: number) => `Showing ${count} role${count !== 1 ? 's' : ''}`,
    roleNotFound: 'Role not found',
    backToRoles: 'Back to Roles',
  },

  // Detail page sections
  detail: {
    permissions: 'Permissions',
    module: 'Module',
    modulePermissions: (module: string) => `${module} Module`,
  },
}


