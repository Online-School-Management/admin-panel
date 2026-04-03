import type { ApiUser } from '@/features/auth/types/auth.types'

/** Must match backend `RoleSeeder` and `CheckPermission` (`hasRole('super_admin')`). */
export const SUPER_ADMIN_ROLE_SLUG = 'super_admin' as const

export function isSuperAdmin(me: ApiUser | undefined): boolean {
  return Boolean(me?.admin?.roles?.some((r) => r.slug === SUPER_ADMIN_ROLE_SLUG))
}
