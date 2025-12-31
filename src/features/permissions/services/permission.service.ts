import apiClient from '@/services/api-client'
import type {
  PermissionsResponse,
  PermissionResponse,
  PermissionsGroupedResponse,
  ModulesResponse,
} from '../types/permission.types'

/**
 * Permission service - handles all permission-related API calls
 */

/**
 * Get all permissions
 */
export async function getPermissions(): Promise<PermissionsResponse> {
  const response = await apiClient.get<PermissionsResponse>('/permissions')
  return response.data
}

/**
 * Get a single permission by ID
 */
export async function getPermissionById(id: number): Promise<PermissionResponse> {
  const response = await apiClient.get<PermissionResponse>(`/permissions/${id}`)
  return response.data
}

/**
 * Get permissions filtered by module
 */
export async function getPermissionsByModule(
  module: string
): Promise<PermissionsResponse> {
  const response = await apiClient.get<PermissionsResponse>(
    `/permissions/modules/${module}`
  )
  return response.data
}

/**
 * Get permissions grouped by module
 */
export async function getPermissionsGroupedByModule(): Promise<PermissionsGroupedResponse> {
  const response = await apiClient.get<PermissionsGroupedResponse>(
    '/permissions/grouped/modules'
  )
  return response.data
}

/**
 * Get all available modules
 */
export async function getModules(): Promise<ModulesResponse> {
  const response = await apiClient.get<ModulesResponse>('/permissions/modules')
  return response.data
}


