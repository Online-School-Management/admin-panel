/**
 * Validation messages (English)
 */

export const validation = {
  required: (field: string) => `${field} is required`,
  minLength: (field: string, min: number) => `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) => `${field} must not exceed ${max} characters`,
  invalidEmail: 'Please enter a valid email address',
  passwordMismatch: 'Passwords do not match',
  passwordConfirmationRequired: 'Password confirmation is required',
}


