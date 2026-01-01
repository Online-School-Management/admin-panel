/**
 * i18n main index
 * Exports translations and default configuration
 */

import { en } from './locales/en'
import { mm } from './locales/mm'
import type { Locale } from './types'

export type { Locale, TranslationParams } from './types'

export const translations = {
  en,
  mm,
} as const

export const defaultLocale: Locale = 'en'
export const supportedLocales: Locale[] = ['en', 'mm']

// Re-export context and hook for convenience
export { I18nProvider, useTranslation } from './context'

