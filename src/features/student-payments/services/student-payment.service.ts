import apiClient from '@/services/api-client'
import type {
  StudentPaymentsResponse,
  StudentPaymentResponse,
  UpdateStudentPaymentInput,
} from '../types/student-payment.types'

/**
 * Student Payment service - handles all student payment-related API calls
 */

/**
 * Get all student payments with filters and pagination
 */
export async function getStudentPayments(params?: {
  page?: number
  per_page?: number
  enrollment_id?: number
  student_id?: number
  course_id?: number
  status?: string
  search?: string
  order_by?: string
  order_dir?: string
}): Promise<StudentPaymentsResponse> {
  const response = await apiClient.get<StudentPaymentsResponse>('/student-payments', { params })
  return response.data
}

/**
 * Get a single student payment by ID
 */
export async function getStudentPaymentById(id: number): Promise<StudentPaymentResponse> {
  const response = await apiClient.get<StudentPaymentResponse>(`/student-payments/${id}`)
  return response.data
}

/**
 * Get student payments by enrollment ID
 */
export async function getStudentPaymentsByEnrollment(enrollmentId: number): Promise<StudentPaymentsResponse> {
  const response = await apiClient.get<StudentPaymentsResponse>(`/student-payments/enrollment/${enrollmentId}`)
  return response.data
}

/**
 * Update an existing student payment
 */
export async function updateStudentPayment(
  id: number,
  data: UpdateStudentPaymentInput
): Promise<StudentPaymentResponse> {
  const response = await apiClient.put<StudentPaymentResponse>(`/student-payments/${id}`, data)
  return response.data
}

/**
 * Delete a student payment
 */
export async function deleteStudentPayment(id: number): Promise<void> {
  await apiClient.delete(`/student-payments/${id}`)
}


