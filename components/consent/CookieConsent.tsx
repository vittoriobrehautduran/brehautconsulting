'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

// Cookie consent for analytics (GDPR / ePrivacy).
// - Google Tag Manager is NOT loaded until the visitor accepts.
// - Consent Mode v2 defaults to "denied" (set inline in the locale layout).
// - The choice is stored in localStorage; "Cookie settings" in the footer
//   reopens the banner via the OPEN_CONSENT_EVENT window event.

const STORAGE_KEY = 'bc-consent'
export const OPEN_CONSENT_EVENT = 'bc:open-consent'

type Choice = 'granted' | 'denied'

// window.dataLayer is typed in lib/analytics/gtm.ts.

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || []
  // Consent commands must be pushed as an Arguments-like object, like gtag.js does.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments)
}

function setConsent(choice: Choice) {
  gtag('consent', 'update', {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  })
}

function loadGtm(gtmId: string) {
  if (!gtmId || document.getElementById('gtm-script')) return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  const script = document.createElement('script')
  script.id = 'gtm-script'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`
  document.head.appendChild(script)
}

// Best-effort removal of Google Analytics cookies after consent is withdrawn.
function clearAnalyticsCookies() {
  const host = window.location.hostname
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim()
    if (!/^(_ga|_gid|_gat)/.test(name)) return
    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`
    })
  })
}

function readChoice(): Choice | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

export default function CookieConsent({ gtmId }: { gtmId: string }) {
  const t = useTranslations('consent')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const stored = readChoice()
    if (stored === 'granted') {
      setConsent('granted')
      loadGtm(gtmId)
    } else if (stored === null) {
      setOpen(true)
    }

    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_CONSENT_EVENT, reopen)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen)
  }, [gtmId])

  const choose = useCallback(
    (choice: Choice) => {
      const previous = readChoice()
      try {
        window.localStorage.setItem(STORAGE_KEY, choice)
      } catch {
        // Private mode etc. — the choice just won't persist.
      }
      setConsent(choice)
      setOpen(false)

      if (choice === 'granted') {
        loadGtm(gtmId)
      } else if (previous === 'granted') {
        // GTM can't be unloaded from a running page: clear its cookies and reload.
        clearAnalyticsCookies()
        window.location.reload()
      }
    },
    [gtmId]
  )

  if (!open) return null

  return (
    <div
      className="consent"
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      aria-describedby="consent-text"
    >
      <p id="consent-title" className="consent__title">
        {t('title')}
      </p>
      <p id="consent-text" className="consent__text">
        {t('text')}{' '}
        <Link href="/privacy" className="consent__link">
          {t('privacyLink')}
        </Link>
      </p>
      <div className="consent__actions">
        <button type="button" className="consent__btn" onClick={() => choose('denied')}>
          {t('decline')}
        </button>
        <button
          type="button"
          className="consent__btn consent__btn--primary"
          onClick={() => choose('granted')}
        >
          {t('accept')}
        </button>
      </div>
    </div>
  )
}
