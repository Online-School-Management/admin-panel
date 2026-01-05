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
  }
  course: {
    id: number
    title: string
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
  due_date: string
  payment_date: string | null
  paid_at: string | null
  status: 'pending' | 'paid'
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
  due_date: string
  payment_date: string | null
  status: string
  payment_method: string | null
  enrollment?: StudentPaymentEnrollment
  received_by_admin?: StudentPaymentReceivedBy | null
  created_at: string
}

export interface UpdateStudentPaymentInput {
  status?: 'pending' | 'paid'
  amount_paid?: number
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


