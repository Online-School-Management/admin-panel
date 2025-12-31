/**
 * Permission types and interfaces
 */

export interface Permission {
  id: number
  name: string
  slug: string
  module: string
  description: string | null
  created_at?: string
}

export interface PermissionsResponse {
  success: boolean
  message?: string
  data: Permission[]
}

export interface PermissionResponse {
  success: boolean
  message?: string
  data: Permission
}

export interface PermissionsGroupedResponse {
  success: boolean
  message?: string
  data: Record<string, Permission[]>
}

export interface ModulesResponse {
  success: boolean
  message?: string
  data: string[]
}


