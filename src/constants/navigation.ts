import { Home, Shield, UserCog, Key, GraduationCap, LucideIcon } from 'lucide-react'

export interface NavigationItem {
  to: string
  icon: LucideIcon
  label: string
}

export const mainNavigation: NavigationItem[] = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
]

export const adminNavigation: NavigationItem[] = [
  { to: '/admins', icon: UserCog, label: 'Admins' },
  { to: '/teachers', icon: GraduationCap, label: 'Teachers' },
  { to: '/roles', icon: Shield, label: 'Roles' },
  { to: '/permissions', icon: Key, label: 'Permissions' },
]

