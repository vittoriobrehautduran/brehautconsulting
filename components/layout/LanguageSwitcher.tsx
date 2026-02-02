'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { locales, type Locale } from '@/i18n'
import { Globe, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const localeNames: Record<Locale, string> = {
  en: 'English',
  sv: 'Swedish',
}

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const switchLocale = (newLocale: Locale) => {
    // Get pathname without locale prefix
    // pathname from next-intl already excludes the locale
    const pathWithoutLocale = pathname || '/'
    // Navigate to new locale with same path
    router.push(pathWithoutLocale, { locale: newLocale })
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white/10 text-white/90 hover:text-white group"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
        <ChevronDown 
          className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 mt-2 w-40 bg-black/95 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        style={{ top: '100%' }}
      >
        <div className="py-1">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                locale === loc
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
              aria-label={`Switch to ${localeNames[loc]}`}
            >
              <div className="flex items-center justify-between">
                <span>{localeNames[loc]}</span>
                {locale === loc && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60"></span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

