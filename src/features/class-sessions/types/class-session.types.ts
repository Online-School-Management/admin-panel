/**
 * Class session types for the standalone class sessions page
 */

export interface ClassSessionListItem {
  id: number
  session_date: string
  status: 'scheduled' | 'completed' | 'cancelled'
  topic_covered: string | null
  schedule: {
    id: number
    day_of_week: string
    start_time: string
    end_time: string
    room_or_link: string | null
  } | null
  course: {
    id: number
    slug: string
    title: string
    course_type: 'one_on_one' | 'private' | 'group' | 'teacher_training'
    subject: {
      id: number
      name: string
    } | null
  } | null
  teacher: {
    id: number
    name: string
  } | null
  enrollment_count: number
  session_number: number | null
  total_sessions: number | null
}

export interface ClassSessionsResponse {
  success: boolean
  message?: string
  data: ClassSessionListItem[]
}

/** Single session for edit form (GET /class-sessions/:id) */
export interface ClassSessionDetail {
  id: number
  status: 'scheduled' | 'completed' | 'cancelled'
  topic_covered: string | null
  room_or_link: string | null
  teacher_id: number | null
  teacher: { id: number; name: string } | null
}

export interface ClassSessionDetailResponse {
  success: boolean
  message?: string
  data: ClassSessionDetail
}

export interface UpdateClassSessionInput {
  status?: 'scheduled' | 'completed' | 'cancelled'
  topic_covered?: string | null
  room_or_link?: string | null
  teacher_id?: number | null
}

export interface CreateClassSessionInput {
  schedule_id: number
  session_date: string
  status?: 'scheduled' | 'completed' | 'cancelled'
  topic_covered?: string | null
}
