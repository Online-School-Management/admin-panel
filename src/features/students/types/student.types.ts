/**
 * Student types and interfaces
 */

export interface StudentUser {
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

export interface Student {
  id: number
  student_id: string
  slug: string
  user: StudentUser | null
  guardian_phone?: string | null
  age?: number | null
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

// For list view (simplified)
export interface StudentCollectionItem {
  id: number
  student_id: string
  slug: string
  user: {
    id: number
    name: string
    email: string
    phone: string | null
    status: string
    profile_image: string | null
  } | null
  guardian_phone: string | null
  age: number | null
  status: string
  created_at: string
}

export interface CreateStudentInput {
  name: string
  email: string
  guardian_phone: string
  age: number
  gender: 'male' | 'female' | 'other'
  address: string
  phone?: string
  date_of_birth?: string | null
  profile_image?: string
  status?: 'active' | 'inactive' | 'suspended'
  student_id?: string
  slug?: string
}

export interface UpdateStudentInput {
  name?: string
  email?: string
  password?: string
  password_confirmation?: string
  guardian_phone?: string
  age?: number
  gender?: 'male' | 'female' | 'other'
  address?: string
  phone?: string
  date_of_birth?: string | null
  profile_image?: string
  status?: 'active' | 'inactive' | 'suspended'
  student_id?: string
  slug?: string
}

export interface StudentsResponse {
  success: boolean
  message?: string
  data: StudentCollectionItem[]
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

export interface StudentResponse {
  success: boolean
  message?: string
  data: Student
}

