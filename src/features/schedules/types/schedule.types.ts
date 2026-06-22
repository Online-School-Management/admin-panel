/**
 * Schedule types and interfaces
 */

export interface ScheduleCourse {
  id: number
  slug: string
  title: string
  subject: {
    id: number
    name: string
    slug: string
  }
}

export interface ScheduleTeacher {
  id: number
  name: string
  email?: string
}

export interface Schedule {
  id: number
  course: ScheduleCourse
  teacher?: ScheduleTeacher | null
  teacher_id?: number | null
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  start_time: string
  end_time: string
  room_or_link?: string | null
  topic_covered?: string | null
  created_at?: string
  updated_at?: string
}

// For list view (simplified)
export interface ScheduleCollectionItem {
  id: number
  course: ScheduleCourse
  teacher?: ScheduleTeacher | null
  teacher_id?: number | null
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  start_time: string
  end_time: string
  room_or_link?: string | null
  topic_covered?: string | null
  created_at: string
}

export interface CreateScheduleInput {
  course_id: number
  teacher_id: number | null
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  start_time: string
  end_time: string
  room_or_link?: string | null
  topic_covered?: string | null
}

export interface UpdateScheduleInput {
  course_id?: number
  teacher_id?: number | null
  day_of_week?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  start_time?: string
  end_time?: string
  room_or_link?: string | null
  topic_covered?: string | null
}

export interface CourseTeacherForSchedule {
  id: number
  name: string | null
  email: string | null
  commission_type: string | null
  commission_rate?: number | null
  monthly_salary_amount?: number | null
  per_session_amount?: number | null
  fixed_amount?: number | null
}

export interface CourseTeachersForScheduleResponse {
  success: boolean
  message?: string
  data: CourseTeacherForSchedule[]
}

export interface SchedulesResponse {
  success: boolean
  message?: string
  data: ScheduleCollectionItem[]
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

export interface ScheduleResponse {
  success: boolean
  message?: string
  data: Schedule
}

