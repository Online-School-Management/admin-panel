import apiClient from '@/services/api-client'
import type {
  EnrollmentsResponse,
  EnrollmentResponse,
  CreateEnrollmentInput,
  UpdateEnrollmentInput,
} from '../types/enrollment.types'

const BASE_URL = '/enrollments'

/**
 * Get all enrollments with filters and pagination
 */
export async function getEnrollments(params?: {
  page?: number
  per_page?: number
  search?: string
  sort_by?: string
  sort_order?: string
  student_id?: number
  course_id?: number
  status?: string
  enrolled_from?: string
  enrolled_to?: string
}): Promise<EnrollmentsResponse> {
  const response = await apiClient.get<EnrollmentsResponse>(BASE_URL, { params })
  return response.data
}

/**
 * Get a single enrollment by ID
 */
export async function getEnrollmentById(id: number): Promise<EnrollmentResponse> {
  const response = await apiClient.get<EnrollmentResponse>(`${BASE_URL}/${id}`)
  return response.data
}

/**
 * Get enrollments by student ID
 */
export async function getEnrollmentsByStudent(studentId: number): Promise<EnrollmentsResponse> {
  const response = await apiClient.get<EnrollmentsResponse>(`${BASE_URL}/student/${studentId}`)
  return response.data
}

/**
 * Get enrollments by course ID
 */
export async function getEnrollmentsByCourse(courseId: number): Promise<EnrollmentsResponse> {
  const response = await apiClient.get<EnrollmentsResponse>(`${BASE_URL}/course/${courseId}`)
  return response.data
}

/**
 * Create a new enrollment
 */
export async function createEnrollment(data: CreateEnrollmentInput): Promise<EnrollmentResponse> {
  const response = await apiClient.post<EnrollmentResponse>(BASE_URL, data)
  return response.data
}

/**
 * Update an existing enrollment
 */
export async function updateEnrollment(
  id: number,
  data: UpdateEnrollmentInput
): Promise<EnrollmentResponse> {
  const response = await apiClient.put<EnrollmentResponse>(`${BASE_URL}/${id}`, data)
  return response.data
}

/**
 * Delete an enrollment
 */
export async function deleteEnrollment(id: number): Promise<void> {
  await apiClient.delete(`${BASE_URL}/${id}`)
}

