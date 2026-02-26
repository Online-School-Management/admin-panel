import { z } from 'zod'
import { VALIDATION, VALIDATION_MESSAGES } from '@/constants'

const articleFormBaseSchema = z.object({
  title: z
    .string()
    .min(VALIDATION.MIN_NAME_LENGTH, VALIDATION_MESSAGES.MIN_LENGTH('Title', VALIDATION.MIN_NAME_LENGTH)),
  category: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  body: z.string().min(1, 'Body/content is required'),
  image_url: z.string().optional().nullable(),
  status: z.enum(['draft', 'published']),
})

export const createArticleSchema = articleFormBaseSchema

export const updateArticleSchema = articleFormBaseSchema.extend({
  title: z
    .string()
    .min(VALIDATION.MIN_NAME_LENGTH, VALIDATION_MESSAGES.MIN_LENGTH('Title', VALIDATION.MIN_NAME_LENGTH))
    .optional()
    .or(z.literal('')),
  body: z.string().optional().or(z.literal('')),
})

export type CreateArticleFormData = z.infer<typeof createArticleSchema>
export type UpdateArticleFormData = z.infer<typeof updateArticleSchema>
