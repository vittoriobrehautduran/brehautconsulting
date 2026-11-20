'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import BlocksNav from '@/components/blocks/BlocksNav'
import BlocksFooter from '@/components/blocks/BlocksFooter'
import BlocksStyles from '@/components/blocks/BlocksStyles'
import { HOME } from '@/components/blocks/serviceRoutes'

// Localized error page for runtime errors inside a page.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('error')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <>
      <BlocksStyles />
      <div className="blocks-site blocks-site--page">
        <BlocksNav />
        <main className="blocks-site__page">
          <div className="blocks-site__wrap blocks-site__status">
            <h1>{t('title')}</h1>
            <p>{t('text')}</p>
            <div className="blocks-site__actions">
              <button
                type="button"
                className="blocks-scroll__cta blocks-scroll__cta--solid"
                onClick={reset}
              >
                {t('retry')}
              </button>
              <Link className="blocks-site__ghost" href={HOME}>
                {t('home')}
              </Link>
            </div>
          </div>
        </main>
        <BlocksFooter />
      </div>
    </>
  )
}
