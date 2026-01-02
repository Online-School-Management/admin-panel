/**
 * Course types and interfaces
 */

export interface CourseSubject {
  id: number
  name: string
  slug: string
  description?: string | null
}

export interface Course {
  id: number
  slug: string
  subject: CourseSubject
  title: string
  duration_months: number
  monthly_fee?: number | null
  total_fee?: number | null
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
  start_date?: string | null
  end_date?: string | null
  created_at?: string
  updated_at?: string
}

// For list view (simplified)
export interface CourseCollectionItem {
  id: number
  slug: string
  subject: {
    id: number
    name: string
    slug: string
  }
  title: string
  duration_months: number
  monthly_fee: number | null
  total_fee: number | null
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
  start_date: string | null
  end_date: string | null
  created_at: string
}

export interface CreateCourseInput {
  subject_id: number
  title: string
  slug?: string
  duration_months?: number
  monthly_fee?: number | null
  status?: 'upcoming' | 'active' | 'completed' | 'cancelled'
  start_date?: string | null
  end_date?: string | null
}

export interface UpdateCourseInput {
  subject_id?: number
  title?: string
  slug?: string
  duration_months?: number
  monthly_fee?: number | null
  status?: 'upcoming' | 'active' | 'completed' | 'cancelled'
  start_date?: string | null
  end_date?: string | null
}

export interface CoursesResponse {
  success: boolean
  message?: string
  data: CourseCollectionItem[]
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

export interface CourseResponse {
  success: boolean
  message?: string
  data: Course
}

