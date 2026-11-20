'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import BlocksNav from '@/components/blocks/BlocksNav'
import BlocksFooter from '@/components/blocks/BlocksFooter'
import { sitePath } from '@/components/blocks/serviceRoutes'

// Advertising & Demand Capture service page for the /blocks redesign.
export default function BlocksServiceAds() {
  const tHome = useTranslations('home.services.service4')
  const tDetails = useTranslations('services.serviceDetails.service4')
  const tCommon = useTranslations('common.buttons')
  const tBlocks = useTranslations('blocks')
  const tNav = useTranslations('common.nav')

  const details = (tDetails.raw('details') as string[]) || []
  const benefits = (tDetails.raw('benefitsList') as string[]) || []

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

          <header className="blocks-site__page-intro" aria-labelledby="svc-ads-h">
            <h1 id="svc-ads-h">
              <span className="blocks-site__title-num" aria-hidden="true">
                03
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

          <section className="blocks-site__panel" aria-labelledby="svc-ads-do">
            <div className="blocks-site__two-col">
              <div>
                <h2 id="svc-ads-do">{tDetails('whatWeDo')}</h2>
                <ul className="blocks-site__plain-list">
                  {details.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2>{tDetails('benefits')}</h2>
                <ul className="blocks-site__plain-list">
                  {benefits.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="blocks-site__panel" aria-labelledby="svc-ads-next">
            <div className="blocks-site__close-block">
              <div>
                <h2 id="svc-ads-next">{tBlocks(`serviceNext.service4.title`)}</h2>
                <p>{tBlocks(`serviceNext.service4.body`)}</p>
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
