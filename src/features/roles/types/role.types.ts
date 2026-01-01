/**
 * Role types and interfaces
 */

import type { Permission } from '@/features/permissions/types/permission.types'

export interface Role {
  id: number
  name: string
  slug: string
  description: string | null
  status: 'active' | 'inactive'
  permissions?: Permission[]
  permissions_count?: number
  created_at?: string
}

export interface RolesResponse {
  success: boolean
  message?: string
  data: Role[]
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

export interface RoleResponse {
  success: boolean
  message?: string
  data: Role
}



