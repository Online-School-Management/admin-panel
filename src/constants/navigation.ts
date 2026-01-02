import { Home, Shield, UserCog, Key, GraduationCap, Users, BookOpen, BookText, LucideIcon } from 'lucide-react'

export interface NavigationItem {
  to: string
  icon: LucideIcon
  label: string
}

export const mainNavigation: NavigationItem[] = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/teachers', icon: GraduationCap, label: 'Teachers' },
  { to: '/students', icon: Users, label: 'Students' },
]

export const subjectNavigation: NavigationItem[] = [
  { to: '/subjects', icon: BookOpen, label: 'Subjects' },
  { to: '/courses', icon: BookText, label: 'Courses' },
]

export const adminNavigation: NavigationItem[] = [
  { to: '/admins', icon: UserCog, label: 'Admins' },
  { to: '/roles', icon: Shield, label: 'Roles' },
  { to: '/permissions', icon: Key, label: 'Permissions' },
]

