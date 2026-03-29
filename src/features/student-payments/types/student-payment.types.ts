/**
 * Student Payment types and interfaces
 */

export interface StudentPaymentEnrollment {
  id: number
  student: {
    id: number
    name: string
    email: string
    student_id: string
    slug: string
  }
  course: {
    id: number
    title: string
    slug: string
    start_date: string
    subject: {
      id: number
      name: string
    } | null
  }
}

export interface StudentPaymentReceivedBy {
  id: number
  name: string
  email: string
}

export interface StudentPayment {
  id: number
  enrollment_id: number
  month_number: number
  amount_paid: number | null
  original_amount: number | null
  due_date: string
  payment_date: string | null
  paid_at: string | null
  status: 'pending' | 'paid' | 'free'
  discount_type?: 'percentage' | 'fixed' | null
  discount_value?: number | null
  payment_method: 'kbz_pay' | 'aya_pay' | 'kbz_mobile_banking' | 'wave_money' | null
  notes: string | null
  received_by: number | null
  enrollment?: StudentPaymentEnrollment
  received_by_admin?: StudentPaymentReceivedBy | null
  created_at?: string
  updated_at?: string
}

// For list view (simplified)
export interface StudentPaymentCollectionItem {
  id: number
  enrollment_id: number
  month_number: number
  amount_paid: number | null
  original_amount: number | null
  due_date: string
  payment_date: string | null
  status: string
  discount_type?: 'percentage' | 'fixed' | null
  discount_value?: number | null
  payment_method: string | null
  enrollment?: StudentPaymentEnrollment
  received_by_admin?: StudentPaymentReceivedBy | null
  created_at: string
}

export interface UpdateStudentPaymentInput {
  status?: 'pending' | 'paid' | 'free'
  amount_paid?: number
  original_amount?: number | null
  discount_type?: 'percentage' | 'fixed' | null
  discount_value?: number | null
  payment_date?: string
  paid_at?: string
  received_by?: number
  payment_method?: 'kbz_pay' | 'aya_pay' | 'kbz_mobile_banking' | 'wave_money'
  notes?: string
}

export interface StudentPaymentsResponse {
  success: boolean
  message?: string
  data: StudentPaymentCollectionItem[]
  meta?: {
    pagination: {
      current_page: number
      per_page: number
      total: number
      last_page: number
      from: number | null
      to: number | null
    }
  }
}

export interface StudentPaymentResponse {
  success: boolean
  message?: string
  data: StudentPayment
}

export interface MarkPaidBulkInput {
  payment_ids: number[]
  payment_date?: string
  payment_method?: 'kbz_pay' | 'aya_pay' | 'kbz_mobile_banking' | 'wave_money'
  received_by?: number
  notes?: string
}

export interface MarkPaidBulkResponse {
  success: boolean
  message?: string
  data: { updated_count: number }
}


