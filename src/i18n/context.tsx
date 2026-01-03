import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { translations, defaultLocale, supportedLocales } from './index'
import type { Locale, TranslationParams } from './types'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: TranslationParams) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

/**
 * I18n Provider
 * Provides translation context to the entire application
 * Persists language preference in localStorage
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Get from localStorage or use default
    // Use try-catch to handle cases where localStorage might not be available
    try {
      const saved = localStorage.getItem('locale') as Locale
      return saved && supportedLocales.includes(saved) ? saved : defaultLocale
    } catch {
      return defaultLocale
    }
  })

  // Ensure locale is valid on mount (handles HMR issues)
  useEffect(() => {
    if (!supportedLocales.includes(locale)) {
      setLocaleState(defaultLocale)
    }
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem('locale', newLocale)
    } catch {
      // Ignore localStorage errors (e.g., in private browsing)
    }
  }

  /**
   * Translation function
   * @param key - Translation key in dot notation (e.g., 'common.buttons.save')
   * @param params - Optional parameters for string interpolation
   * @returns Translated string
   */
  const t = (key: string, params?: TranslationParams): string => {
    const keys = key.split('.')
    let value: any = translations[locale]

    // Navigate through nested object
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
    }

    // Handle function values (e.g., validation.required('Name'))
    if (typeof value === 'function') {
      return value(params as any)
    }

    // Replace params if provided
    if (params && typeof value === 'string') {
      return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
        return params[paramKey]?.toString() || ''
      })
    }

    return typeof value === 'string' ? value : key
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

/**
 * useTranslation hook
 * Must be used within I18nProvider
 * Includes fallback to prevent errors during HMR or lazy loading
 */
export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    // During development/HMR, provide a fallback instead of throwing
    // This prevents errors when components render before provider is ready
    if (import.meta.env.DEV) {
      console.warn('useTranslation called outside I18nProvider, using fallback')
      return {
        locale: defaultLocale,
        setLocale: () => {},
        t: (key: string) => key, // Return key as fallback
      }
    }
    throw new Error('useTranslation must be used within I18nProvider')
  }
  return context
}

