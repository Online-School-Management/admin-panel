import { z } from 'zod'

/**
 * Student Payment form validation schemas
 */

export const updateStudentPaymentSchema = z.object({
  status: z.enum(['pending', 'paid']).optional(),
  amount_paid: z.number().min(0).max(999999.99).optional().nullable(),
  payment_date: z.string().optional().nullable(),
  paid_at: z.string().optional().nullable(),
  received_by: z.number().int().positive().optional().nullable(),
  payment_method: z.enum(['kbz_pay', 'aya_pay', 'kbz_mobile_banking', 'wave_money']).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
})

// Export types
export type UpdateStudentPaymentFormData = z.infer<typeof updateStudentPaymentSchema>

