'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import BlocksNav from '@/components/blocks/BlocksNav'
import BlocksFooter from '@/components/blocks/BlocksFooter'
import { sitePath } from '@/components/blocks/serviceRoutes'
import BlocksServiceDetails from '@/components/blocks/BlocksServiceDetails'
import BlocksOtherServices from '@/components/blocks/BlocksOtherServices'

// Analytics & Measurement service page for the /blocks redesign.
export default function BlocksServiceAnalytics() {
  const tHome = useTranslations('home.services.service5')
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

          <header className="blocks-site__page-intro" aria-labelledby="svc-analytics-h">
            <h1 id="svc-analytics-h">
              <span className="blocks-site__title-num" aria-hidden="true">
                04
              </span>
              {tHome('title')}
            </h1>
            <p>{tHome('description')}</p>
          </header>

          <BlocksServiceDetails serviceKey="service5" idPrefix="svc-analytics" />

          <section className="blocks-site__panel" aria-labelledby="svc-analytics-next">
            <div className="blocks-site__close-block">
              <div>
                <h2 id="svc-analytics-next">{tBlocks(`serviceNext.service5.title`)}</h2>
                <p>{tBlocks(`serviceNext.service5.body`)}</p>
              </div>
              <Link
                className="blocks-scroll__cta blocks-scroll__cta--solid"
                href={sitePath('contact')}
              >
                {tCommon('contactUs')}
              </Link>
            </div>
          </section>

          <BlocksOtherServices current="service5" />
        </div>
      </main>

      <BlocksFooter />
    </div>
  )
}
