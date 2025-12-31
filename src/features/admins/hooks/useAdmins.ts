import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  getAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  assignRole,
  revokeRole,
  getAdminPermissions,
} from '../services/admin.service'
import {
  showCreateSuccessToast,
  showUpdateSuccessToast,
  showDeleteSuccessToast,
  showCreateErrorToast,
  showUpdateErrorToast,
  showDeleteErrorToast,
  showSuccessToast,
  showErrorToast,
} from '@/utils/toast'
import type {
  CreateAdminInput,
  UpdateAdminInput,
  AssignRoleInput,
} from '../types/admin.types'

/**
 * Query keys for admin-related queries
 */
export const adminKeys = {
  all: ['admins'] as const,
  lists: () => [...adminKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...adminKeys.lists(), params] as const,
  details: () => [...adminKeys.all, 'detail'] as const,
  detail: (id: number) => [...adminKeys.details(), id] as const,
  permissions: (id: number) => [...adminKeys.detail(id), 'permissions'] as const,
}

/**
 * Hook to fetch all admins with filters and pagination
 */
export function useAdmins(params?: {
  page?: number
  per_page?: number
  status?: string
  department?: string
  search?: string
  sort_by?: string
  sort_order?: string
}) {
  return useQuery({
    queryKey: adminKeys.list(params),
    queryFn: () => getAdmins(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch a single admin by ID
 */
export function useAdmin(id: number) {
  return useQuery({
    queryKey: adminKeys.detail(id),
    queryFn: () => getAdminById(id),
    enabled: !!id,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
  })
}

/**
 * Hook to create a new admin
 */
export function useCreateAdmin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: CreateAdminInput) => createAdmin(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() })
      showCreateSuccessToast('admin', `${response.data.user.name} has been added`)
      navigate('/admins')
    },
    onError: (error: Error) => {
      showCreateErrorToast('admin', error)
    },
  })
}

/**
 * Hook to update an existing admin
 */
export function useUpdateAdmin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAdminInput }) =>
      updateAdmin(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() })
      queryClient.invalidateQueries({ queryKey: adminKeys.detail(variables.id) })
      showUpdateSuccessToast('admin', `${response.data.user.name} has been updated`)
      navigate('/admins')
    },
    onError: (error: Error) => {
      showUpdateErrorToast('admin', error)
    },
  })
}

/**
 * Hook to delete an admin
 */
export function useDeleteAdmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() })
      showDeleteSuccessToast('admin')
    },
    onError: (error: Error) => {
      showDeleteErrorToast('admin', error)
    },
  })
}

/**
 * Hook to assign a role to an admin
 */
export function useAssignRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      adminId,
      data,
    }: {
      adminId: number
      data: AssignRoleInput
    }) => assignRole(adminId, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.detail(variables.adminId) })
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() })
      showSuccessToast('Role assigned successfully', { title: 'Success' })
    },
    onError: (error: Error) => {
      showErrorToast(error.message || 'Failed to assign role', { title: 'Error' })
    },
  })
}

/**
 * Hook to revoke a role from an admin
 */
export function useRevokeRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      adminId,
      roleId,
    }: {
      adminId: number
      roleId: number
    }) => revokeRole(adminId, roleId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.detail(variables.adminId) })
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() })
      showSuccessToast('Role revoked successfully', { title: 'Success' })
    },
    onError: (error: Error) => {
      showErrorToast(error.message || 'Failed to revoke role', { title: 'Error' })
    },
  })
}

/**
 * Hook to fetch admin permissions
 */
export function useAdminPermissions(id: number) {
  return useQuery({
    queryKey: adminKeys.permissions(id),
    queryFn: () => getAdminPermissions(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}


