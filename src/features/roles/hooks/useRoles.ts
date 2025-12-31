import { useQuery } from '@tanstack/react-query'
import { getRoles, getRoleById } from '../services/role.service'
import type { RolesResponse, RoleResponse } from '../types/role.types'

/**
 * Query keys for role-related queries
 */
export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...roleKeys.lists(), params] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: number) => [...roleKeys.details(), id] as const,
}

/**
 * Hook to fetch all roles with pagination
 */
export function useRoles(params?: {
  page?: number
  per_page?: number
  status?: string
}) {
  return useQuery<RolesResponse>({
    queryKey: roleKeys.list(params),
    queryFn: () => getRoles(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch a single role by ID
 */
export function useRole(id: number) {
  return useQuery<RoleResponse>({
    queryKey: roleKeys.detail(id),
    queryFn: () => getRoleById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}


