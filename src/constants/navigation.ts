import { Home, Users, Settings, LucideIcon } from 'lucide-react'

export interface NavigationItem {
  to: string
  icon: LucideIcon
  label: string
}

export const mainNavigation: NavigationItem[] = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/users', icon: Users, label: 'Users' },
]

export const settingsNavigation: NavigationItem[] = [
  { to: '/settings', icon: Settings, label: 'Settings' },
]

