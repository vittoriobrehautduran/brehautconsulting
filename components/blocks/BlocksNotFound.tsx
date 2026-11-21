'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import BlocksNav from '@/components/blocks/BlocksNav'
import BlocksFooter from '@/components/blocks/BlocksFooter'
import { HOME, sitePath } from '@/components/blocks/serviceRoutes'

// Localized 404 content, rendered via LocalizedNotFound from app/not-found.tsx.
export default function BlocksNotFound() {
  const t = useTranslations('notFound')

  return (
    <div className="blocks-site blocks-site--page">
      <BlocksNav />
      <main className="blocks-site__page">
        <div className="blocks-site__wrap blocks-site__status">
          <p className="blocks-site__status-code" aria-hidden="true">
            404
          </p>
          <h1>{t('title')}</h1>
          <p>{t('text')}</p>
          <div className="blocks-site__actions">
            <Link className="blocks-scroll__cta blocks-scroll__cta--solid" href={HOME}>
              {t('home')}
            </Link>
            <Link className="blocks-site__ghost" href={sitePath('contact')}>
              {t('contact')}
            </Link>
          </div>
        </div>
      </main>
      <BlocksFooter />
    </div>
  )
}
