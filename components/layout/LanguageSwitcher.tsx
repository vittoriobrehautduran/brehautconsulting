'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { locales, type Locale } from '@/i18n'

const localeNames: Record<Locale, string> = {
  en: 'EN',
  sv: 'SV',
}

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: Locale) => {
    // Get pathname without locale prefix
    // pathname from next-intl already excludes the locale
    const pathWithoutLocale = pathname || '/'
    // Navigate to new locale with same path
    router.push(pathWithoutLocale, { locale: newLocale })
  }

  return (
    <div className="flex items-center gap-2">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            locale === loc
              ? 'bg-white/20 text-white'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          aria-label={`Switch to ${localeNames[loc]}`}
        >
          {localeNames[loc]}
        </button>
      ))}
    </div>
  )
}

