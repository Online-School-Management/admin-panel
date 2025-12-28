import type { User, UsersResponse } from '../types/user.types'

/**
 * Mock/Demo users data
 * Used when API is not ready
 */
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1 234-567-8900',
    role: 'admin',
    userType: 'individual',
    memberLevel: 'platinum',
    status: 'active',
    avatar: undefined,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '+1 234-567-8901',
    role: 'user',
    userType: 'individual',
    memberLevel: 'gold',
    status: 'active',
    avatar: undefined,
    createdAt: '2024-02-10T09:15:00Z',
    updatedAt: '2024-02-15T11:20:00Z',
  },
  {
    id: '3',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phoneNumber: '+1 234-567-8902',
    role: 'user',
    userType: 'company',
    memberLevel: 'platinum',
    status: 'active',
    avatar: undefined,
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-25T16:30:00Z',
  },
  {
    id: '4',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phoneNumber: '+1 234-567-8903',
    role: 'moderator',
    userType: 'individual',
    memberLevel: 'silver',
    status: 'active',
    avatar: undefined,
    createdAt: '2024-03-01T12:00:00Z',
    updatedAt: '2024-03-05T10:15:00Z',
  },
  {
    id: '5',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    phoneNumber: '+1 234-567-8904',
    role: 'user',
    userType: 'individual',
    memberLevel: 'silver',
    status: 'inactive',
    avatar: undefined,
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-03-10T09:45:00Z',
  },
  {
    id: '6',
    name: 'Tech Solutions Inc',
    email: 'info@techsolutions.com',
    phoneNumber: '+1 234-567-8905',
    role: 'user',
    userType: 'company',
    memberLevel: 'gold',
    status: 'active',
    avatar: undefined,
    createdAt: '2024-01-12T11:20:00Z',
    updatedAt: '2024-02-28T15:00:00Z',
  },
  {
    id: '7',
    name: 'Mike Davis',
    email: 'mike.davis@example.com',
    phoneNumber: '+1 234-567-8906',
    role: 'user',
    userType: 'individual',
    memberLevel: 'silver',
    status: 'suspended',
    avatar: undefined,
    createdAt: '2024-03-15T13:45:00Z',
    updatedAt: '2024-03-18T08:30:00Z',
  },
  {
    id: '8',
    name: 'Emily Brown',
    email: 'emily.brown@example.com',
    phoneNumber: '+1 234-567-8907',
    role: 'user',
    userType: 'individual',
    memberLevel: 'gold',
    status: 'active',
    avatar: undefined,
    createdAt: '2024-02-25T10:00:00Z',
    updatedAt: '2024-03-12T14:20:00Z',
  },
  {
    id: '9',
    name: 'Global Enterprises',
    email: 'contact@globalent.com',
    phoneNumber: '+1 234-567-8908',
    role: 'user',
    userType: 'company',
    memberLevel: 'platinum',
    status: 'active',
    avatar: undefined,
    createdAt: '2024-01-08T09:30:00Z',
    updatedAt: '2024-01-30T12:15:00Z',
  },
  {
    id: '10',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    phoneNumber: '+1 234-567-8909',
    role: 'moderator',
    userType: 'individual',
    memberLevel: 'gold',
    status: 'active',
    avatar: undefined,
    createdAt: '2024-03-05T15:20:00Z',
    updatedAt: '2024-03-10T11:45:00Z',
  },
  {
    id: '11',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    phoneNumber: '+1 234-567-8910',
    role: 'user',
    userType: 'individual',
    memberLevel: 'silver',
    status: 'inactive',
    avatar: undefined,
    createdAt: '2024-02-15T08:45:00Z',
    updatedAt: '2024-03-01T13:30:00Z',
  },
  {
    id: '12',
    name: 'Innovation Labs',
    email: 'hello@innovationlabs.com',
    phoneNumber: '+1 234-567-8911',
    role: 'user',
    userType: 'company',
    memberLevel: 'platinum',
    status: 'active',
    avatar: undefined,
    createdAt: '2024-01-20T10:15:00Z',
    updatedAt: '2024-02-10T16:00:00Z',
  },
]

/**
 * Get mock users with filtering and pagination
 */
export function getMockUsers(params?: {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}): UsersResponse {
  let filteredUsers = [...mockUsers]
  const page = params?.page || 1
  const limit = params?.limit || 10
  const search = params?.search?.toLowerCase()
  const role = params?.role
  const status = params?.status

  // Apply search filter
  if (search) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.phoneNumber?.toLowerCase().includes(search)
    )
  }

  // Apply role filter
  if (role) {
    filteredUsers = filteredUsers.filter((user) => user.role === role)
  }

  // Apply status filter
  if (status) {
    filteredUsers = filteredUsers.filter((user) => user.status === status)
  }

  // Calculate pagination
  const total = filteredUsers.length
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  return {
    users: paginatedUsers,
    total,
    page,
    limit,
  }
}

/**
 * Get mock user by ID
 */
export function getMockUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id)
}


