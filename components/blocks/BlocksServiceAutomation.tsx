'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import BlocksNav from '@/components/blocks/BlocksNav'
import BlocksFooter from '@/components/blocks/BlocksFooter'
import { sitePath } from '@/components/blocks/serviceRoutes'
import BlocksServiceDetails from '@/components/blocks/BlocksServiceDetails'

// Automation & AI Solutions service page for the /blocks redesign.
export default function BlocksServiceAutomation() {
  const tHome = useTranslations('home.services.service6')
  const tCommon = useTranslations('common.buttons')
  const tBlocks = useTranslations('blocks')
  const tNav = useTranslations('common.nav')


  return (
    <div className="blocks-site blocks-site--page">
      <BlocksNav />

      <main className="blocks-site__page">
        <div className="blocks-site__wrap">
          <p className="blocks-site__crumb">
            <Link href={sitePath('how-it-works')}>{tNav("howItWorks")}</Link>
            <span aria-hidden="true"> / </span>
            <span>{tHome('title')}</span>
          </p>

          <header className="blocks-site__page-intro" aria-labelledby="svc-auto-h">
            <h1 id="svc-auto-h">
              <span className="blocks-site__title-num" aria-hidden="true">
                05
              </span>
              {tHome('title')}
            </h1>
            <p>{tHome('subtitle')}</p>
            <p>{tHome('description')}</p>
            <Link
              className="blocks-scroll__cta blocks-scroll__cta--solid"
              href={sitePath('contact')}
            >
              {tCommon('contactUs')}
            </Link>
          </header>

          <BlocksServiceDetails serviceKey="service6" idPrefix="svc-auto" />

          <section className="blocks-site__panel" aria-labelledby="svc-auto-next">
            <div className="blocks-site__close-block">
              <div>
                <h2 id="svc-auto-next">{tBlocks(`serviceNext.service6.title`)}</h2>
                <p>{tBlocks(`serviceNext.service6.body`)}</p>
              </div>
              <Link
                className="blocks-scroll__cta blocks-scroll__cta--solid"
                href={sitePath('contact')}
              >
                {tCommon('contactUs')}
              </Link>
            </div>
          </section>
        </div>
      </main>

      <BlocksFooter />
    </div>
  )
}
