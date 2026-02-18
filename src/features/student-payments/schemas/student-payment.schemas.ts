import { z } from 'zod'

/**
 * Student Payment form validation schemas
 */

export const updateStudentPaymentSchema = z
  .object({
    status: z.enum(['pending', 'paid', 'free']).optional(),
    amount_paid: z.number().min(0).max(999999.99).optional().nullable(),
    original_amount: z.number().min(0).max(999999.99).optional().nullable(),
    discount_type: z.enum(['percentage', 'fixed']).optional().nullable(),
    discount_value: z.number().min(0).max(999999.99).optional().nullable(),
    payment_date: z.string().optional().nullable(),
    paid_at: z.string().optional().nullable(),
    received_by: z.number().int().positive().optional().nullable(),
    payment_method: z.enum(['kbz_pay', 'aya_pay', 'kbz_mobile_banking', 'wave_money']).optional().nullable(),
    notes: z.string().max(5000).optional().nullable(),
  })
  .refine((data) => !data.discount_type || (data.discount_value != null && data.discount_value >= 0), {
    message: 'Discount value is required when discount type is set',
    path: ['discount_value'],
  })

// Export types
export type UpdateStudentPaymentFormData = z.infer<typeof updateStudentPaymentSchema>

