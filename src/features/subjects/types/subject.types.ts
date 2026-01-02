/**
 * Subject types and interfaces
 */

export interface Subject {
  id: number
  name: string
  slug: string
  description?: string | null
  created_at?: string
  updated_at?: string
}

// For list view (simplified)
export interface SubjectCollectionItem {
  id: number
  name: string
  slug: string
  description: string | null
  created_at: string
}

export interface CreateSubjectInput {
  name: string
  slug?: string
  description?: string | null
}

export interface UpdateSubjectInput {
  name?: string
  slug?: string
  description?: string | null
}

export interface SubjectsResponse {
  success: boolean
  message?: string
  data: SubjectCollectionItem[]
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

export interface SubjectResponse {
  success: boolean
  message?: string
  data: Subject
}

