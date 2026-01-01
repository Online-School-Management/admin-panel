import { z } from 'zod'
import { VALIDATION_MESSAGES } from '@/constants'

/**
 * Authentication form validation schemas
 */

/**
 * Schema for login form
 */
export const loginSchema = z.object({
  email: z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL),
  password: z.string().min(1, VALIDATION_MESSAGES.REQUIRED('Password')),
})

// Export type
export type LoginFormData = z.infer<typeof loginSchema>


