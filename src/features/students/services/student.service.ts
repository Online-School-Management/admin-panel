import apiClient from '@/services/api-client'
import type {
  StudentsResponse,
  StudentResponse,
  CreateStudentInput,
  UpdateStudentInput,
} from '../types/student.types'

/**
 * Student service - handles all student-related API calls
 */

/**
 * Get all students with filters and pagination
 */
export async function getStudents(params?: {
  page?: number
  per_page?: number
  status?: string
  search?: string
  sort_by?: string
  sort_order?: string
}): Promise<StudentsResponse> {
  const response = await apiClient.get<StudentsResponse>('/students', { params })
  return response.data
}

/**
 * Get a single student by slug
 */
export async function getStudentBySlug(slug: string): Promise<StudentResponse> {
  const response = await apiClient.get<StudentResponse>(`/students/${slug}`)
  return response.data
}

/**
 * Create a new student
 */
export async function createStudent(data: CreateStudentInput): Promise<StudentResponse> {
  const response = await apiClient.post<StudentResponse>('/students', data)
  return response.data
}

/**
 * Update an existing student
 */
export async function updateStudent(
  slug: string,
  data: UpdateStudentInput
): Promise<StudentResponse> {
  const response = await apiClient.put<StudentResponse>(`/students/${slug}`, data)
  return response.data
}

/**
 * Delete a student
 */
export async function deleteStudent(slug: string): Promise<void> {
  await apiClient.delete(`/students/${slug}`)
}



