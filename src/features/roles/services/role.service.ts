import apiClient from '@/services/api-client'
import type { RolesResponse, RoleResponse } from '../types/role.types'

/**
 * Role service - handles all role-related API calls
 */

/**
 * Get all roles with pagination
 */
export async function getRoles(params?: {
  page?: number
  per_page?: number
  status?: string
}): Promise<RolesResponse> {
  const response = await apiClient.get<RolesResponse>('/roles', { params })
  return response.data
}

/**
 * Get a single role by ID
 */
export async function getRoleById(id: number): Promise<RoleResponse> {
  const response = await apiClient.get<RoleResponse>(`/roles/${id}`)
  return response.data
}



