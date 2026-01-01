import apiClient from '@/services/api-client'
import type {
  AdminsResponse,
  AdminResponse,
  CreateAdminInput,
  UpdateAdminInput,
  AssignRoleInput,
  AdminPermissionsResponse,
} from '../types/admin.types'

/**
 * Admin service - handles all admin-related API calls
 */

/**
 * Get all admins with filters and pagination
 */
export async function getAdmins(params?: {
  page?: number
  per_page?: number
  status?: string
  department?: string
  search?: string
  sort_by?: string
  sort_order?: string
}): Promise<AdminsResponse> {
  const response = await apiClient.get<AdminsResponse>('/admins', { params })
  return response.data
}

/**
 * Get a single admin by ID
 */
export async function getAdminById(id: number): Promise<AdminResponse> {
  const response = await apiClient.get<AdminResponse>(`/admins/${id}`)
  return response.data
}

/**
 * Create a new admin
 */
export async function createAdmin(data: CreateAdminInput): Promise<AdminResponse> {
  const response = await apiClient.post<AdminResponse>('/admins', data)
  return response.data
}

/**
 * Update an existing admin
 */
export async function updateAdmin(
  id: number,
  data: UpdateAdminInput
): Promise<AdminResponse> {
  const response = await apiClient.put<AdminResponse>(`/admins/${id}`, data)
  return response.data
}

/**
 * Delete an admin
 */
export async function deleteAdmin(id: number): Promise<void> {
  await apiClient.delete(`/admins/${id}`)
}

/**
 * Assign a role to an admin
 */
export async function assignRole(
  adminId: number,
  data: AssignRoleInput
): Promise<AdminResponse> {
  const response = await apiClient.post<AdminResponse>(
    `/admins/${adminId}/roles`,
    data
  )
  return response.data
}

/**
 * Revoke a role from an admin
 */
export async function revokeRole(
  adminId: number,
  roleId: number
): Promise<AdminResponse> {
  const response = await apiClient.delete<AdminResponse>(
    `/admins/${adminId}/roles/${roleId}`
  )
  return response.data
}

/**
 * Get all permissions for an admin
 */
export async function getAdminPermissions(
  id: number
): Promise<AdminPermissionsResponse> {
  const response = await apiClient.get<AdminPermissionsResponse>(
    `/admins/${id}/permissions`
  )
  return response.data
}



