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
  image_url: z.string().url().max(500).optional().nullable(),
  description: z.string().max(65535).optional().nullable(),
  short_description: z.string().optional().nullable(),
  tag_en: z.string().max(100).optional().nullable(),
  tag_mm: z.string().max(100).optional().nullable(),
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





