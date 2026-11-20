'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { locales, type Locale } from '@/i18n'

const LOCALE_LABEL: Record<Locale, string> = {
  en: 'EN',
  sv: 'SV',
  es: 'ES',
}

const LOCALE_NAME: Record<Locale, string> = {
  en: 'English',
  sv: 'Svenska',
  es: 'Español',
}

// Compact language control for the redesign nav.
export default function BlocksLanguageSwitcher({
  onNavigate,
}: {
  onNavigate?: () => void
}) {
  const locale = useLocale() as Locale
  const t = useTranslations('common')
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return
      setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const switchLocale = (next: Locale) => {
    if (next === locale) {
      setOpen(false)
      return
    }
    router.push(pathname || '/', { locale: next })
    setOpen(false)
    onNavigate?.()
  }

  return (
    <div
      ref={rootRef}
      className={`blocks-scroll__lang${open ? ' is-open' : ''}`}
    >
      <button
        type="button"
        className="blocks-scroll__lang-trigger"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="listbox"
        aria-label={t('language')}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{LOCALE_LABEL[locale]}</span>
        <span aria-hidden="true">▾</span>
      </button>
      {open ? (
        <ul id={menuId} className="blocks-scroll__lang-menu" role="listbox">
          {locales.map((loc) => (
            <li key={loc} role="option" aria-selected={loc === locale}>
              <button
                type="button"
                className={loc === locale ? 'is-active' : undefined}
                onClick={() => switchLocale(loc)}
              >
                <span className="blocks-scroll__lang-code">{LOCALE_LABEL[loc]}</span>
                <span>{LOCALE_NAME[loc]}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
