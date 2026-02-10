import apiClient from '@/services/api-client'
import type {
  PayoutsResponse,
  PayoutResponse,
  MarkPayoutsPaidBulkInput,
  MarkPayoutsPaidBulkResponse,
} from '../types/payout.types'

/**
 * Payout service - handles all payout-related API calls
 */

/**
 * Get all payouts with filters and pagination
 */
export async function getPayouts(params?: {
  page?: number
  per_page?: number
  recipient_type?: string
  recipient_id?: number
  status?: string
  payout_month?: string
  period_start?: string
  period_end?: string
  search?: string
  order_by?: string
  order_dir?: string
}): Promise<PayoutsResponse> {
  const response = await apiClient.get<PayoutsResponse>('/payouts', { params })
  return response.data
}

/**
 * Get a single payout by ID (with detail rows)
 */
export async function getPayoutById(id: number): Promise<PayoutResponse> {
  const response = await apiClient.get<PayoutResponse>(`/payouts/${id}`)
  return response.data
}

/**
 * Mark a single payout as paid (one click)
 */
export async function markPayoutAsPaid(id: number): Promise<PayoutResponse> {
  const response = await apiClient.put<PayoutResponse>(`/payouts/${id}/mark-paid`)
  return response.data
}

/**
 * Mark multiple payouts as paid (bulk)
 */
export async function markPayoutsAsPaidBulk(data: MarkPayoutsPaidBulkInput): Promise<MarkPayoutsPaidBulkResponse> {
  const response = await apiClient.put<MarkPayoutsPaidBulkResponse>('/payouts/mark-paid-bulk', data)
  return response.data
}
