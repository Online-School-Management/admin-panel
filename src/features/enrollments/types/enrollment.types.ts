/**
 * Enrollment types and interfaces
 */

export interface EnrollmentStudent {
  id: number
  slug: string
  student_id: string
  name: string
  email: string | null
  phone: string | null
  status: string
}

export interface EnrollmentCourse {
  id: number
  slug: string
  title: string
  subject: {
    id: number
    name: string
    slug: string
  }
}

export interface Enrollment {
  id: number
  student: EnrollmentStudent | null
  course: EnrollmentCourse
  enrolled_at: string
  status: 'active' | 'dropped' | 'completed'
  created_at?: string
  updated_at?: string
}

// For list view (simplified)
export interface EnrollmentCollectionItem {
  id: number
  student: {
    id: number
    slug: string
    student_id: string
    name: string
    email: string | null
  } | null
  course: {
    id: number
    slug: string
    title: string
    subject: {
      id: number
      name: string
    }
  }
  enrolled_at: string
  status: 'active' | 'dropped' | 'completed'
  created_at: string
}

export interface CreateEnrollmentInput {
  student_id: number
  course_id: number
  enrolled_at?: string | null
  status?: 'active' | 'dropped' | 'completed'
}

export interface UpdateEnrollmentInput {
  student_id?: number
  course_id?: number
  enrolled_at?: string | null
  status?: 'active' | 'dropped' | 'completed'
}

export interface EnrollmentsResponse {
  success: boolean
  message?: string
  data: EnrollmentCollectionItem[]
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

export interface EnrollmentResponse {
  success: boolean
  message?: string
  data: Enrollment
}

