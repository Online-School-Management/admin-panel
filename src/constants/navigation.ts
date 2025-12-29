import { Home, Users, Settings, Shield, UserCog, Key, LucideIcon } from 'lucide-react'

export interface NavigationItem {
  to: string
  icon: LucideIcon
  label: string
}

export const mainNavigation: NavigationItem[] = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/users', icon: Users, label: 'Users' },
]

export const adminNavigation: NavigationItem[] = [
  { to: '/admins', icon: UserCog, label: 'Admins' },
  { to: '/roles', icon: Shield, label: 'Roles' },
  { to: '/permissions', icon: Key, label: 'Permissions' },
]

export const settingsNavigation: NavigationItem[] = [
  { to: '/settings', icon: Settings, label: 'Settings' },
]

