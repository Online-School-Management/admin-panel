/**
 * Teacher Payout types and interfaces
 */

export interface TeacherPayoutTeacher {
  id: number
  slug: string | null
  name: string | null
  email: string | null
  teacher_id: string
  commission_type: string | null
}

export interface TeacherPayoutCourse {
  id: number
  slug: string
  title: string
}

export interface TeacherPayout {
  id: number
  teacher_id: number
  course_id: number | null
  commission_type: 'monthly_percent' | 'monthly_salary' | 'per_session' | 'fixed_amount'
  period_start: string
  period_end: string
  payout_month: string | null
  total_collected: number
  commission_rate: number | null
  sessions_count: number
  per_session_rate: number | null
  salary_amount: number | null
  payout_amount: number
  status: 'pending' | 'paid'
  paid_at: string | null
  notes: string | null
  teacher?: TeacherPayoutTeacher
  course?: TeacherPayoutCourse | null
  created_at?: string
  updated_at?: string
}

export interface TeacherPayoutCollectionItem {
  id: number
  teacher_id: number
  course_id: number | null
  commission_type: 'monthly_percent' | 'monthly_salary' | 'per_session' | 'fixed_amount'
  period_start: string
  period_end: string
  payout_month: string | null
  total_collected: number
  commission_rate: number | null
  sessions_count: number
  per_session_rate: number | null
  salary_amount: number | null
  payout_amount: number
  status: 'pending' | 'paid'
  paid_at: string | null
  notes: string | null
  teacher?: TeacherPayoutTeacher
  course?: TeacherPayoutCourse | null
  created_at: string
}

export interface CalculatePayoutInput {
  period_start: string
  period_end: string
  payout_month?: string | null
}

export interface PayoutSessionWarning {
  course_id: number
  course_title: string
  teacher_id: number | null
  session_count: number
  reason: 'unassigned' | 'no_course_teacher'
}

export interface CalculatePayoutResult {
  period_start: string
  period_end: string
  payout_month: string | null
  deleted_previous: number
  created_count: number
  total_amount: number
  warnings?: PayoutSessionWarning[]
}

export interface MarkAsPaidBulkInput {
  ids: number[]
}

export interface MarkAsPaidBulkResult {
  updated_count: number
}

export interface TeacherPayoutsResponse {
  success: boolean
  message?: string
  data: TeacherPayoutCollectionItem[]
  meta?: {
    pagination: {
      current_page: number
      per_page: number
      total: number
      last_page: number
      from: number | null
      to: number | null
    }
    period_totals?: {
      total_from_students: number
      total_to_teachers: number
    }
  }
}

export interface TeacherPayoutResponse {
  success: boolean
  message?: string
  data: TeacherPayout
}

export interface CalculatePayoutResponse {
  success: boolean
  message?: string
  data: CalculatePayoutResult
}

export interface MarkAsPaidBulkResponse {
  success: boolean
  message?: string
  data: MarkAsPaidBulkResult
}
