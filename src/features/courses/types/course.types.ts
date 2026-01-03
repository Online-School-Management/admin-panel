/**
 * Course types and interfaces
 */

export interface CourseSubject {
  id: number
  name: string
  slug: string
  description?: string | null
}

export interface CourseSchedule {
  id: number
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  start_time: string
  end_time: string
  room_or_link: string | null
}

export interface Course {
  id: number
  slug: string
  subject: CourseSubject
  title: string
  duration_months: number
  monthly_fee?: number | null
  total_fee?: number | null
  course_type: 'one_on_one' | 'private' | 'group' | 'teacher_training'
  total_hours?: number | null
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled'
  start_date?: string | null
  end_date?: string | null
  assigned_teacher: {
    id: number
    name: string
    email: string
    commission_rate: number | null
  } | null
  schedules: CourseSchedule[]
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
  course_type: 'one_on_one' | 'private' | 'group' | 'teacher_training'
  total_hours: number | null
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled'
  start_date: string | null
  end_date: string | null
  assigned_teacher: {
    id: number
    name: string
    commission_rate: number | null
  } | null
  created_at: string
}

export interface CreateCourseInput {
  subject_id: number
  title: string
  slug?: string
  duration_months?: number
  monthly_fee?: number | null
  course_type?: 'one_on_one' | 'private' | 'group' | 'teacher_training'
  status?: 'upcoming' | 'in_progress' | 'completed' | 'cancelled'
  start_date?: string | null
  end_date?: string | null
}

export interface UpdateCourseInput {
  subject_id?: number
  title?: string
  slug?: string
  duration_months?: number
  monthly_fee?: number | null
  course_type?: 'one_on_one' | 'private' | 'group' | 'teacher_training'
  status?: 'upcoming' | 'in_progress' | 'completed' | 'cancelled'
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

