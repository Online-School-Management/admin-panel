export interface EnrollmentRequestUser {
  id: number
  name: string
  email: string
  phone?: string | null
  address?: string | null
  student?: {
    id: number
    student_id: string
    slug: string
    status: string
  } | null
}

export interface EnrollmentRequestCourse {
  id: number
  slug: string
  title: string
  status: string
  subject?: {
    id: number
    name: string
    slug: string
  } | null
}

export interface EnrollmentRequestAdmin {
  id: number
  admin_id: string
  name?: string | null
}

export interface EnrollmentRequest {
  id: number
  status: 'pending' | 'approved' | 'rejected'
  name_en: string
  age: number | null
  education: string | null
  class_interest: string | null
  school_type: string
  school_other: string | null
  facebook_account: string | null
  phone: string
  town_address: string | null
  user: EnrollmentRequestUser | null
  course: EnrollmentRequestCourse | null
  approved_by: EnrollmentRequestAdmin | null
  approved_at: string | null
  rejected_by: EnrollmentRequestAdmin | null
  rejected_at: string | null
  rejection_reason: string | null
  created_at: string | null
  updated_at: string | null
}

export interface EnrollmentRequestCollectionItem {
  id: number
  status: 'pending' | 'approved' | 'rejected'
  name_en: string
  phone: string
  class_interest: string | null
  user: {
    id: number
    name: string
    email: string
  } | null
  course: {
    id: number
    slug: string
    title: string
  } | null
  approved_at: string | null
  rejected_at: string | null
  created_at: string | null
}

export interface EnrollmentRequestsResponse {
  success: boolean
  message?: string
  data: EnrollmentRequestCollectionItem[]
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

export interface EnrollmentRequestResponse {
  success: boolean
  message?: string
  data: EnrollmentRequest
}

export interface ApproveEnrollmentRequestInput {
  first_n_months_free?: number
  discount_type?: 'percentage' | 'fixed' | null
  discount_value?: number | null
}

export interface RejectEnrollmentRequestInput {
  rejection_reason: string
}
