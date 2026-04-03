import { Shield, UserCog, Key, GraduationCap, Users, BookOpen, BookText, CreditCard, CalendarDays, Wallet, ClipboardList, FileText, Newspaper, LucideIcon } from 'lucide-react'

export interface NavigationItem {
  to: string
  icon: LucideIcon
  label: string
  /** Backend permission slug required to show this link (must match API middleware). */
  permission?: string
}

export const classNavigation: NavigationItem[] = [
  { to: '/class-sessions', icon: CalendarDays, label: 'Class Sessions', permission: 'schedules.view' },
  // { to: '/dashboard', icon: Home, label: 'Dashboard' },
]

export const mainNavigation: NavigationItem[] = [
  // { to: '/class-sessions', icon: CalendarDays, label: 'Class Sessions' },
  // { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/enrollment-requests', icon: FileText, label: 'Enrollment Requests', permission: 'enrollments.view' },
  { to: '/students', icon: Users, label: 'Students', permission: 'students.view' },
  { to: '/enrollments', icon: BookText, label: 'Enrollments', permission: 'enrollments.view' },
  { to: '/student-payments', icon: CreditCard, label: 'Student Payments', permission: 'student_payments.view' },
  { to: '/teacher-payouts', icon: Wallet, label: 'Teacher Payouts', permission: 'teachers.view' },
  { to: '/monthly-closing', icon: ClipboardList, label: 'Monthly closing', permission: 'monthly_close.view' },
]

export const subjectNavigation: NavigationItem[] = [
  { to: '/subjects', icon: BookOpen, label: 'Subjects', permission: 'subjects.view' },
  { to: '/courses', icon: BookText, label: 'Courses', permission: 'courses.view' },
  { to: '/articles', icon: Newspaper, label: 'Articles', permission: 'articles.view' },
  { to: '/teachers', icon: GraduationCap, label: 'Teachers', permission: 'teachers.view' },
]

export const adminNavigation: NavigationItem[] = [
  { to: '/admins', icon: UserCog, label: 'Admins', permission: 'admins.view' },
  { to: '/roles', icon: Shield, label: 'Roles', permission: 'roles.view' },
  { to: '/permissions', icon: Key, label: 'Permissions', permission: 'permissions.view' },
]

