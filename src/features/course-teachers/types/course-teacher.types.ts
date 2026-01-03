/**
 * Course-Teacher types and interfaces
 */

export interface CourseTeacherCourse {
  id: number
  slug: string
  title: string
}

export interface CourseTeacherTeacher {
  id: number
  teacher_id: string
  slug: string
  user: {
    id: number
    name: string
    email: string
  }
}

export interface CourseTeacher {
  id: number
  course: CourseTeacherCourse
  teacher: CourseTeacherTeacher
  commission_rate?: number | null
  created_at?: string
  updated_at?: string
}

// For list view (simplified)
export interface CourseTeacherCollectionItem {
  id: number
  course: CourseTeacherCourse
  teacher: CourseTeacherTeacher
  commission_rate: number | null
  created_at: string
}

export interface CreateCourseTeacherInput {
  course_id: number
  teacher_id: number
  commission_rate?: number | null
}

export interface UpdateCourseTeacherInput {
  course_id?: number
  teacher_id?: number
  commission_rate?: number | null
}

export interface CourseTeachersResponse {
  success: boolean
  message?: string
  data: CourseTeacherCollectionItem[]
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

export interface CourseTeacherResponse {
  success: boolean
  message?: string
  data: CourseTeacher
}



