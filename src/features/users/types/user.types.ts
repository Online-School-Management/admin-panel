/**
 * User types and interfaces
 */

export interface User {
  id: string
  name: string
  email: string
  phoneNumber?: string
  role: 'admin' | 'user' | 'moderator'
  userType?: 'individual' | 'company'
  memberLevel?: 'silver' | 'gold' | 'platinum'
  status: 'active' | 'inactive' | 'suspended'
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserInput {
  name: string
  email: string
  phoneNumber?: string
  role: 'admin' | 'user' | 'moderator'
  userType?: 'individual' | 'company'
  memberLevel?: 'silver' | 'gold' | 'platinum'
  status?: 'active' | 'inactive' | 'suspended'
  password: string
}

export interface UpdateUserInput {
  name?: string
  email?: string
  phoneNumber?: string
  role?: 'admin' | 'user' | 'moderator'
  userType?: 'individual' | 'company'
  memberLevel?: 'silver' | 'gold' | 'platinum'
  status?: 'active' | 'inactive' | 'suspended'
  password?: string
}

export interface UsersResponse {
  users: User[]
  total: number
  page: number
  limit: number
}

export interface UserResponse {
  user: User
}

