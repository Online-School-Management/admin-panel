import { Shield, UserCog, Key, GraduationCap, Users, BookOpen, BookText, CreditCard, CalendarDays, Wallet, ClipboardList, FileText, LucideIcon } from 'lucide-react'

export interface NavigationItem {
  to: string
  icon: LucideIcon
  label: string
}

export const classNavigation: NavigationItem[] = [
  { to: '/class-sessions', icon: CalendarDays, label: 'Class Sessions' },
  // { to: '/dashboard', icon: Home, label: 'Dashboard' },
]

export const mainNavigation: NavigationItem[] = [
  // { to: '/class-sessions', icon: CalendarDays, label: 'Class Sessions' },
  // { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/enrollment-requests', icon: FileText, label: 'Enrollment Requests' },
  { to: '/students', icon: Users, label: 'Students' },
  { to: '/enrollments', icon: BookText, label: 'Enrollments' },
  { to: '/student-payments', icon: CreditCard, label: 'Student Payments' },
  { to: '/teacher-payouts', icon: Wallet, label: 'Teacher Payouts' },
  { to: '/monthly-closing', icon: ClipboardList, label: 'Monthly closing' },
]

export const subjectNavigation: NavigationItem[] = [
  { to: '/subjects', icon: BookOpen, label: 'Subjects' },
  { to: '/courses', icon: BookText, label: 'Courses' },
  { to: '/teachers', icon: GraduationCap, label: 'Teachers' },
]

export const adminNavigation: NavigationItem[] = [
  { to: '/admins', icon: UserCog, label: 'Admins' },
  { to: '/roles', icon: Shield, label: 'Roles' },
  { to: '/permissions', icon: Key, label: 'Permissions' },
]

