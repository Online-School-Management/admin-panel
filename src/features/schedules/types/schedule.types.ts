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
  email: string
}

export interface Schedule {
  id: number
  course: ScheduleCourse
  teacher: ScheduleTeacher
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
  teacher: ScheduleTeacher
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  start_time: string
  end_time: string
  room_or_link?: string | null
  topic_covered?: string | null
  created_at: string
}

export interface CreateScheduleInput {
  course_id: number
  teacher_id: number
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  start_time: string
  end_time: string
  room_or_link?: string | null
  topic_covered?: string | null
}

export interface UpdateScheduleInput {
  course_id?: number
  teacher_id?: number
  day_of_week?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  start_time?: string
  end_time?: string
  room_or_link?: string | null
  topic_covered?: string | null
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

