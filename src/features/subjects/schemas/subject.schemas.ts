import { z } from 'zod'
import { VALIDATION, VALIDATION_MESSAGES } from '@/constants'

/**
 * Subject form validation schemas
 * Separate schemas for create and update operations
 */

// Base schema shared by both create and update
const subjectFormBaseSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.MIN_NAME_LENGTH, VALIDATION_MESSAGES.MIN_LENGTH('Name', VALIDATION.MIN_NAME_LENGTH)),
  description: z.string().optional().nullable(),
})

/**
 * Schema for creating a new subject
 */
export const createSubjectSchema = subjectFormBaseSchema

/**
 * Schema for updating an existing subject
 */
export const updateSubjectSchema = subjectFormBaseSchema.extend({
  name: z
    .string()
    .min(VALIDATION.MIN_NAME_LENGTH, VALIDATION_MESSAGES.MIN_LENGTH('Name', VALIDATION.MIN_NAME_LENGTH))
    .optional()
    .or(z.literal('')),
})

// Export types
export type CreateSubjectFormData = z.infer<typeof createSubjectSchema>
export type UpdateSubjectFormData = z.infer<typeof updateSubjectSchema>



