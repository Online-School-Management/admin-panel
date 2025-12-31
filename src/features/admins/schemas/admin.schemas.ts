import { z } from 'zod'
import { VALIDATION, VALIDATION_MESSAGES, ADMIN_STATUS } from '@/constants'

/**
 * Admin form validation schemas
 * Separate schemas for create and update operations
 */

// Base schema shared by both create and update
const adminFormBaseSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.MIN_NAME_LENGTH, VALIDATION_MESSAGES.MIN_LENGTH('Name', VALIDATION.MIN_NAME_LENGTH)),
  status: z.enum([ADMIN_STATUS.ACTIVE, ADMIN_STATUS.INACTIVE, ADMIN_STATUS.SUSPENDED]).optional(),
  department: z.string().optional(),
  role_id: z.number().optional(),
})

/**
 * Schema for creating a new admin
 * Password is required
 */
export const createAdminSchema = adminFormBaseSchema.extend({
  password: z
    .string()
    .min(VALIDATION.MIN_PASSWORD_LENGTH, VALIDATION_MESSAGES.MIN_LENGTH('Password', VALIDATION.MIN_PASSWORD_LENGTH)),
  password_confirmation: z.string().min(1, VALIDATION_MESSAGES.PASSWORD_CONFIRMATION_REQUIRED),
}).refine(
  (data) => data.password === data.password_confirmation,
  {
    message: VALIDATION_MESSAGES.PASSWORD_MISMATCH,
    path: ['password_confirmation'],
  }
)

/**
 * Schema for updating an existing admin
 * Password is optional (only validate if provided)
 */
export const updateAdminSchema = adminFormBaseSchema.extend({
  password: z
    .string()
    .min(VALIDATION.MIN_PASSWORD_LENGTH, VALIDATION_MESSAGES.MIN_LENGTH('Password', VALIDATION.MIN_PASSWORD_LENGTH))
    .optional()
    .or(z.literal('')),
  password_confirmation: z.string().optional(),
}).refine(
  (data) => {
    // If password is provided, confirmation must match
    if (data.password && data.password.length > 0) {
      return data.password === data.password_confirmation
    }
    return true
  },
  {
    message: VALIDATION_MESSAGES.PASSWORD_MISMATCH,
    path: ['password_confirmation'],
  }
)

// Export types
export type CreateAdminFormData = z.infer<typeof createAdminSchema>
export type UpdateAdminFormData = z.infer<typeof updateAdminSchema>

