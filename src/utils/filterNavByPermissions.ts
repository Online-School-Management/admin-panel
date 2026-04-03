import type { NavigationItem } from '@/constants/navigation'
import type { ApiUser } from '@/features/auth/types/auth.types'
import { isSuperAdmin } from '@/utils/isSuperAdmin'

/**
 * Hide nav items when the admin lacks the linked permission.
 * If /auth/me has no permission list, show all (legacy / non-admin).
 * Super admin sees every item regardless of permission slugs.
 */
export function filterNavigationByPermissions(
  items: NavigationItem[],
  me: ApiUser | undefined
): NavigationItem[] {
  if (!me || me.user_type !== 'admin') {
    return items
  }
  if (isSuperAdmin(me)) {
    return items
  }
  const perms = me.admin?.permissions
  if (!perms?.length) {
    return items
  }
  const slugs = new Set(perms.map((p) => p.slug))
  return items.filter((item) => !item.permission || slugs.has(item.permission))
}
