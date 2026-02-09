import apiClient from '@/services/api-client'
import type {
  TeacherPayoutsResponse,
  TeacherPayoutResponse,
  CalculatePayoutInput,
  CalculatePayoutResponse,
  MarkAsPaidBulkInput,
  MarkAsPaidBulkResponse,
} from '../types/teacher-payout.types'

/**
 * Teacher Payout service - handles all teacher payout-related API calls
 */

/**
 * Get all teacher payouts with filters and pagination
 */
export async function getTeacherPayouts(params?: {
  page?: number
  per_page?: number
  teacher_id?: number
  course_id?: number
  commission_type?: string
  status?: string
  payout_month?: string
  period_start?: string
  period_end?: string
  search?: string
  order_by?: string
  order_dir?: string
}): Promise<TeacherPayoutsResponse> {
  const response = await apiClient.get<TeacherPayoutsResponse>('/teacher-payouts', { params })
  return response.data
}

/**
 * Get a single teacher payout by ID
 */
export async function getTeacherPayoutById(id: number): Promise<TeacherPayoutResponse> {
  const response = await apiClient.get<TeacherPayoutResponse>(`/teacher-payouts/${id}`)
  return response.data
}

/**
 * Calculate payouts for a period
 */
export async function calculatePayouts(data: CalculatePayoutInput): Promise<CalculatePayoutResponse> {
  const response = await apiClient.post<CalculatePayoutResponse>('/teacher-payouts/calculate', data)
  return response.data
}

/**
 * Mark a single payout as paid
 */
export async function markPayoutAsPaid(id: number): Promise<TeacherPayoutResponse> {
  const response = await apiClient.put<TeacherPayoutResponse>(`/teacher-payouts/${id}/mark-paid`)
  return response.data
}

/**
 * Mark multiple payouts as paid (bulk)
 */
export async function markPayoutsAsPaidBulk(data: MarkAsPaidBulkInput): Promise<MarkAsPaidBulkResponse> {
  const response = await apiClient.put<MarkAsPaidBulkResponse>('/teacher-payouts/mark-paid-bulk', data)
  return response.data
}
