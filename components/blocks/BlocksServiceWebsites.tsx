'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import BlocksNav from '@/components/blocks/BlocksNav'
import BlocksFooter from '@/components/blocks/BlocksFooter'
import BlocksTechCarousel from '@/components/blocks/BlocksTechCarousel'
import { sitePath } from '@/components/blocks/serviceRoutes'
import BlocksServiceDetails from '@/components/blocks/BlocksServiceDetails'
import { WEB_TECH_STACK } from '@/components/blocks/techStack'

// Website & web application service page for the /blocks redesign.
export default function BlocksServiceWebsites() {
  const tHome = useTranslations('home.services.service1')
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

          <header className="blocks-site__page-intro" aria-labelledby="svc-web-h">
            <h1 id="svc-web-h">
              <span className="blocks-site__title-num" aria-hidden="true">
                01
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
        </div>

        <BlocksTechCarousel items={WEB_TECH_STACK} label={tBlocks("techStackLabel")} />

        <div className="blocks-site__wrap">
          <BlocksServiceDetails serviceKey="service1" idPrefix="svc-web" />

          <section className="blocks-site__panel" aria-labelledby="svc-web-next">
            <div className="blocks-site__close-block">
              <div>
                <h2 id="svc-web-next">{tBlocks(`serviceNext.service1.title`)}</h2>
                <p>{tBlocks(`serviceNext.service1.body`)}</p>
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
