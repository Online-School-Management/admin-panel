import apiClient from '@/services/api-client'
import type {
  SubjectsResponse,
  SubjectResponse,
  CreateSubjectInput,
  UpdateSubjectInput,
} from '../types/subject.types'

/**
 * Subject service - handles all subject-related API calls
 */

/**
 * Get all subjects with filters and pagination
 */
export async function getSubjects(params?: {
  page?: number
  per_page?: number
  search?: string
  sort_by?: string
  sort_order?: string
}): Promise<SubjectsResponse> {
  const response = await apiClient.get<SubjectsResponse>('/subjects', { params })
  return response.data
}

/**
 * Get a single subject by slug
 */
export async function getSubjectBySlug(slug: string): Promise<SubjectResponse> {
  const response = await apiClient.get<SubjectResponse>(`/subjects/${slug}`)
  return response.data
}

/**
 * Create a new subject
 */
export async function createSubject(data: CreateSubjectInput): Promise<SubjectResponse> {
  const response = await apiClient.post<SubjectResponse>('/subjects', data)
  return response.data
}

/**
 * Update an existing subject
 */
export async function updateSubject(
  slug: string,
  data: UpdateSubjectInput
): Promise<SubjectResponse> {
  const response = await apiClient.put<SubjectResponse>(`/subjects/${slug}`, data)
  return response.data
}

/**
 * Delete a subject
 */
export async function deleteSubject(slug: string): Promise<void> {
  await apiClient.delete(`/subjects/${slug}`)
}



