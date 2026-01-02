import { Home, Shield, UserCog, Key, GraduationCap, Users, BookOpen, LucideIcon } from 'lucide-react'

export interface NavigationItem {
  to: string
  icon: LucideIcon
  label: string
}

export const mainNavigation: NavigationItem[] = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/teachers', icon: GraduationCap, label: 'Teachers' },
  { to: '/students', icon: Users, label: 'Students' },
  { to: '/subjects', icon: BookOpen, label: 'Subjects' },
]

export const adminNavigation: NavigationItem[] = [
  { to: '/admins', icon: UserCog, label: 'Admins' },
  { to: '/roles', icon: Shield, label: 'Roles' },
  { to: '/permissions', icon: Key, label: 'Permissions' },
]

