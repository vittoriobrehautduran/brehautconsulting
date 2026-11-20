'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import BlocksNav from '@/components/blocks/BlocksNav'
import BlocksFooter from '@/components/blocks/BlocksFooter'
import { sitePath } from '@/components/blocks/serviceRoutes'

// Analytics & Measurement service page for the /blocks redesign.
export default function BlocksServiceAnalytics() {
  const tHome = useTranslations('home.services.service5')
  const tDetails = useTranslations('services.serviceDetails.service5')
  const tCommon = useTranslations('common.buttons')

  const details = (tDetails.raw('details') as string[]) || []
  const benefits = (tDetails.raw('benefitsList') as string[]) || []

  return (
    <div className="blocks-site blocks-site--page">
      <BlocksNav />

      <main className="blocks-site__page">
        <div className="blocks-site__wrap">
          <p className="blocks-site__crumb">
            <Link href={sitePath('how-it-works')}>How it works</Link>
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
            <p>{tHome('subtitle')}</p>
            <p>{tHome('description')}</p>
            <Link
              className="blocks-scroll__cta blocks-scroll__cta--solid"
              href={sitePath('contact')}
            >
              {tCommon('contactUs')}
            </Link>
          </header>

          <section className="blocks-site__panel" aria-labelledby="svc-analytics-do">
            <div className="blocks-site__two-col">
              <div>
                <h2 id="svc-analytics-do">{tDetails('whatWeDo')}</h2>
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

          <section className="blocks-site__panel" aria-labelledby="svc-analytics-next">
            <div className="blocks-site__close-block">
              <div>
                <h2 id="svc-analytics-next">See what works</h2>
                <p>
                  Measurement should answer simple questions — which pages,
                  campaigns, and paths actually bring enquiries — so you can
                  spend time and budget on what moves the business.
                </p>
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
