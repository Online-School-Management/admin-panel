/**
 * Permission feature translations (English)
 */

export const permission = {
  // Page titles
  pages: {
    list: 'Permissions',
  },

  // Descriptions
  descriptions: {
    list: 'View all available permissions in the system',
  },

  // Table headers
  table: {
    id: 'ID',
    name: 'Name',
    slug: 'Slug',
    module: 'Module',
    description: 'Description',
    createdAt: 'Created At',
  },

  // Filters
  filters: {
    searchPermissions: 'Search permissions...',
  },

  // Messages
  messages: {
    noPermissions: 'No permissions available',
    noPermissionsFound: 'No permissions found matching your criteria',
    showingPermissions: (count: number) => `Showing ${count} permission${count !== 1 ? 's' : ''}`,
  },
}


