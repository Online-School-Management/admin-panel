import { useTranslation } from '@/i18n/context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Locale } from '@/i18n/types'

/**
 * Language Switcher Component
 * Allows users to switch between supported languages
 */
export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()

  return (
    <Select value={locale} onValueChange={(value) => setLocale(value as Locale)}>
      <SelectTrigger className="w-[130px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="mm">မြန်မာ</SelectItem>
      </SelectContent>
    </Select>
  )
}

