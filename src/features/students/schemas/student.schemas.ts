import { z } from 'zod'
import { VALIDATION, VALIDATION_MESSAGES } from '@/constants'

/**
 * Student form validation schemas
 * Separate schemas for create and update operations
 * Note: Password is not required for students (default password is set on backend)
 */

// Base schema shared by both create and update
const studentFormBaseSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.MIN_NAME_LENGTH, VALIDATION_MESSAGES.MIN_LENGTH('Name', VALIDATION.MIN_NAME_LENGTH)),
  email: z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL),
  guardian_phone: z.string().min(1, VALIDATION_MESSAGES.REQUIRED('Guardian Phone')),
  age: z.number().int().min(1, VALIDATION_MESSAGES.MIN_LENGTH('Age', 1)).max(150),
  gender: z.enum(['male', 'female', 'other']),
  address: z.string().min(1, VALIDATION_MESSAGES.REQUIRED('Address')),
  phone: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
  date_of_birth: z.string().optional().nullable(),
  education: z.string().max(100).optional().nullable(),
  school_type: z.enum(['government', 'international', 'private', 'other']).optional().nullable(),
  school_other: z.string().max(100).optional().nullable(),
  class: z.string().max(50).optional().nullable(),
  facebook_link: z.string().max(500).optional().nullable(),
})

// Refinement: when school_type is "other", school_other must be provided
const schoolOtherRefinement = (data: { school_type?: string | null; school_other?: string | null }) => {
  if (data.school_type === 'other') {
    return !!data.school_other?.trim()
  }
  return true
}
const schoolOtherRefinementOptions = { message: 'Please specify school when "Other" is selected', path: ['school_other'] }

/**
 * Schema for creating a new student
 * Password is NOT required (default password is set on backend)
 */
export const createStudentSchema = studentFormBaseSchema.refine(schoolOtherRefinement, schoolOtherRefinementOptions)

/**
 * Schema for updating an existing student
 * All mandatory fields are required (name, email, guardian_phone, age, gender, address)
 * Password is optional (only validate if provided)
 */
export const updateStudentSchema = studentFormBaseSchema
  .extend({
    password: z
      .string()
      .min(VALIDATION.MIN_PASSWORD_LENGTH, VALIDATION_MESSAGES.MIN_LENGTH('Password', VALIDATION.MIN_PASSWORD_LENGTH))
      .optional()
      .or(z.literal('')),
    password_confirmation: z.string().optional(),
  })
  .refine(schoolOtherRefinement, schoolOtherRefinementOptions)
  .refine(
    (data) => {
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
export type CreateStudentFormData = z.infer<typeof createStudentSchema>
export type UpdateStudentFormData = z.infer<typeof updateStudentSchema>

