/**
 * Admin types and interfaces
 */

import type { Role } from '@/features/roles/types/role.types'
import type { Permission } from '@/features/permissions/types/permission.types'

export interface AdminUser {
  id: number
  name: string
  email: string
  phone: string | null
  date_of_birth?: string | null
  gender?: 'male' | 'female' | 'other' | null
  address?: string | null
  profile_image?: string | null
  status: 'active' | 'inactive' | 'suspended'
  email_verified_at?: string | null
  last_login_at?: string | null
}

export interface AdminRole {
  id: number
  name: string
  slug: string
}

export interface Admin {
  id: number
  admin_id: string
  user: AdminUser
  hire_date?: string | null
  department?: string | null
  status: 'active' | 'inactive'
  notes?: string | null
  roles?: Role[] | AdminRole[]
  permissions?: Permission[]
  created_at?: string
  updated_at?: string
}

// For list view (simplified)
export interface AdminCollectionItem {
  id: number
  admin_id: string
  user: {
    id: number
    name: string
    email: string
    phone: string | null
    status: string
    profile_image: string | null
  }
  department: string | null
  status: string
  roles: AdminRole[] | null
  created_at: string
}

export interface CreateAdminInput {
  name: string
  email: string // Required - must be provided from frontend
  password: string
  password_confirmation: string
  phone?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  address?: string
  profile_image?: string
  status?: 'active' | 'inactive' | 'suspended'
  admin_id?: string
  hire_date?: string
  department?: string
  notes?: string
  role_id?: number
}

export interface UpdateAdminInput {
  name?: string
  email?: string
  password?: string
  password_confirmation?: string
  phone?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  address?: string
  profile_image?: string
  status?: 'active' | 'inactive' | 'suspended'
  admin_id?: string
  hire_date?: string
  department?: string
  notes?: string
  role_id?: number | null // Allow null to explicitly remove role
}

export interface AssignRoleInput {
  role_id: number
  expires_at?: string
}

export interface AdminsResponse {
  success: boolean
  message?: string
  data: AdminCollectionItem[]
  meta?: {
    pagination: {
      current_page: number
      per_page: number
      total: number
      last_page: number
      from: number | null
      to: number | null
    }
  }
}

export interface AdminResponse {
  success: boolean
  message?: string
  data: Admin
}

export interface AdminPermissionsResponse {
  success: boolean
  message?: string
  data: Permission[]
}

