/**
 * Teacher types and interfaces
 */

export interface TeacherUser {
  id: number
  name: string
  email: string
  phone: string | null
  date_of_birth?: string | null
  gender?: 'male' | 'female' | 'other' | null
  address?: string | null
  profile_image?: string | null
  status: 'active' | 'inactive' | 'suspended'
  email_verified_at?: string | null
  last_login_at?: string | null
}

export interface Teacher {
  id: number
  teacher_id: string
  slug: string
  user: TeacherUser
  hire_date?: string | null
  department?: string | null
  subject?: string | null
  employment_type: 'full-time' | 'part-time' | 'contract'
  commission_rate?: number | null
  status: 'active' | 'inactive' | 'suspended'
  notes?: string | null
  created_at?: string
  updated_at?: string
}

// For list view (simplified)
export interface TeacherCollectionItem {
  id: number
  teacher_id: string
  slug: string
  user: {
    id: number
    name: string
    email: string
    phone: string | null
    status: string
    profile_image: string | null
  }
  department: string | null
  subject: string | null
  employment_type: string
  status: string
  created_at: string
}

export interface CreateTeacherInput {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  address?: string
  profile_image?: string
  status?: 'active' | 'inactive' | 'suspended'
  teacher_id?: string
  hire_date?: string
  department?: string
  subject?: string
  employment_type?: 'full-time' | 'part-time' | 'contract'
  commission_rate?: number
  notes?: string
}

export interface UpdateTeacherInput {
  name?: string
  email?: string
  password?: string
  password_confirmation?: string
  phone?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  address?: string
  profile_image?: string
  status?: 'active' | 'inactive' | 'suspended'
  teacher_id?: string
  hire_date?: string
  department?: string
  subject?: string
  employment_type?: 'full-time' | 'part-time' | 'contract'
  commission_rate?: number
  notes?: string
}

export interface TeachersResponse {
  success: boolean
  message?: string
  data: TeacherCollectionItem[]
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

export interface TeacherResponse {
  success: boolean
  message?: string
  data: Teacher
}

