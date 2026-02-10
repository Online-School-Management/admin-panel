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
  total_collected?: number
  status: 'pending' | 'paid'
  paid_at: string | null
  notes: string | null
  teacher?: PayoutTeacher
  courses_count?: number
  courses?: PayoutCourse[]
  created_at: string
  updated_at?: string
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
