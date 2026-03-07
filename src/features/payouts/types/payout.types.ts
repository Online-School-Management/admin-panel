/**
 * Payout types and interfaces
 * One row per recipient per period
 */

export interface PayoutTeacher {
  id: number
  slug: string | null
  name: string | null
  email: string | null
  teacher_id: string
}

export interface PayoutCourse {
  id: number
  title: string
  slug: string
  subject?: { id: number; name: string } | null
  monthly_fee?: number | null
  total_fee?: number | null
}

export interface PayoutSession {
  id: number
  session_date: string
  status: string
  topic_covered: string | null
  start_time: string | null
  end_time: string | null
}

export interface TeacherPayoutDetail {
  id: number
  teacher_id: number
  course_id: number | null
  commission_type: string
  period_start: string
  period_end: string
  payout_month: string | null
  total_collected: number
  commission_rate: number | null
  sessions_count: number
  per_session_rate: number | null
  salary_amount: number | null
  payout_amount: number
  status: string
  course?: PayoutCourse | null
  sessions?: PayoutSession[]
}

export interface PayoutItem {
  id: number
  recipient_type: string
  recipient_id: number | null
  recipient_name: string | null
  period_start: string
  period_end: string
  payout_month: string | null
  total_amount: number
  bonus_amount?: number
  bonus_notes?: string | null
  total_to_pay?: number
  total_collected?: number
  status: 'pending' | 'paid'
  paid_at: string | null
  notes: string | null
  teacher?: PayoutTeacher
  courses_count?: number
  courses?: PayoutCourse[]
  teacher_payouts?: TeacherPayoutDetail[]
  created_at: string
  updated_at?: string
}

export interface UpdatePayoutBonusInput {
  bonus_amount: number
  bonus_notes?: string | null
}

export interface MarkPayoutPaidInput {
  id: number
}

export interface MarkPayoutsPaidBulkInput {
  ids: number[]
}

export interface MarkPayoutsPaidBulkResult {
  updated_count: number
}

export interface PayoutsResponse {
  success: boolean
  message?: string
  data: PayoutItem[]
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
      total_to_pay: number
      total_pending: number
      total_paid: number
    }
  }
}

export interface PayoutResponse {
  success: boolean
  message?: string
  data: PayoutItem
}

export interface MarkPayoutsPaidBulkResponse {
  success: boolean
  message?: string
  data: MarkPayoutsPaidBulkResult
}

/** Monthly closing summary (totals by type, from_students, balance) */
export interface MonthlyClosingSummary {
  summary: {
    teacher: number
    admin: number
    server: number
    facebook: number
    domain: number
    content_writer: number
    other: number
  }
  from_students: number
  total_to_pay: number
  balance: number
}

export interface CreatePayoutInput {
  recipient_type: 'admin' | 'server' | 'facebook' | 'domain' | 'content_writer' | 'other'
  recipient_id?: number
  recipient_name?: string
  period_start: string
  period_end: string
  payout_month?: string | null
  total_amount: number
  status?: 'pending' | 'paid'
  notes?: string | null
}
