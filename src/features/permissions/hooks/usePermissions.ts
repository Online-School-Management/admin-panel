import { useQuery } from '@tanstack/react-query'
import {
  getPermissions,
  getPermissionById,
  getPermissionsByModule,
  getPermissionsGroupedByModule,
  getModules,
} from '../services/permission.service'
import type {
  PermissionsResponse,
  PermissionResponse,
  PermissionsGroupedResponse,
  ModulesResponse,
} from '../types/permission.types'

/**
 * Query keys for permission-related queries
 */
export const permissionKeys = {
  all: ['permissions'] as const,
  lists: () => [...permissionKeys.all, 'list'] as const,
  list: (module?: string) => [...permissionKeys.lists(), module] as const,
  details: () => [...permissionKeys.all, 'detail'] as const,
  detail: (id: number) => [...permissionKeys.details(), id] as const,
  grouped: () => [...permissionKeys.all, 'grouped'] as const,
  modules: () => [...permissionKeys.all, 'modules'] as const,
}

/**
 * Hook to fetch all permissions
 */
export function usePermissions() {
  return useQuery<PermissionsResponse>({
    queryKey: permissionKeys.list(),
    queryFn: getPermissions,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch a single permission by ID
 */
export function usePermission(id: number) {
  return useQuery<PermissionResponse>({
    queryKey: permissionKeys.detail(id),
    queryFn: () => getPermissionById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch permissions filtered by module
 */
export function usePermissionsByModule(module: string) {
  return useQuery<PermissionsResponse>({
    queryKey: permissionKeys.list(module),
    queryFn: () => getPermissionsByModule(module),
    enabled: !!module,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch permissions grouped by module
 */
export function usePermissionsGrouped() {
  return useQuery<PermissionsGroupedResponse>({
    queryKey: permissionKeys.grouped(),
    queryFn: getPermissionsGroupedByModule,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch all available modules
 */
export function useModules() {
  return useQuery<ModulesResponse>({
    queryKey: permissionKeys.modules(),
    queryFn: getModules,
    staleTime: 1000 * 60 * 10, // 10 minutes (modules don't change often)
  })
}


