'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import BlocksNav from '@/components/blocks/BlocksNav'
import BlocksFooter from '@/components/blocks/BlocksFooter'
import { SERVICE_PAGES, sitePath } from '@/components/blocks/serviceRoutes'

type Step = { title: string; description: string }

// How-it-works redesign — services are links to their own pages, not dropdowns.
export default function BlocksHowItWorks() {
  const t = useTranslations('services')
  const tHome = useTranslations('home.services')
  const tCommon = useTranslations('common.buttons')
  const tBlocks = useTranslations('blocks')
  const tCommonRoot = useTranslations('common')

  const steps = (t.raw('howItWorks.steps') as Step[]) || []
  const fitItems = (t.raw('whoFor.items') as string[]) || []

  return (
    <div className="blocks-site blocks-site--page">
      <BlocksNav />

      <main className="blocks-site__page">
        <div className="blocks-site__wrap">
          <header className="blocks-site__page-intro" aria-labelledby="hiw-h">
            <h1 id="hiw-h">{t('howItWorks.title')}</h1>
            <p>{t('intro.line1')}</p>
          </header>

          <section className="blocks-site__panel" aria-labelledby="hiw-steps-h">
            <div className="blocks-site__panel-head">
              <h2 id="hiw-steps-h">{tBlocks('howItWorks.processTitle')}</h2>
            </div>
            <ol className="blocks-site__steps">
              {steps.map((step, index) => (
                <li key={step.title}>
                  <span className="blocks-site__step-num" aria-hidden="true">
                    {index + 1}
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="blocks-site__panel" aria-labelledby="hiw-who-h">
            <div className="blocks-site__panel-head">
              <h2 id="hiw-who-h">{tBlocks('howItWorks.fitTitle')}</h2>
            </div>
            <ul className="blocks-site__plain-list">
              {fitItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="blocks-site__panel" id="system" aria-labelledby="hiw-system-h">
            <div className="blocks-site__panel-head">
              <h2 id="hiw-system-h">{t('system.title')}</h2>
            </div>

            <ul className="blocks-site__service-links">
              {SERVICE_PAGES.map((service, index) => {
                const href = sitePath('services', service.slug)
                const title = tHome(`${service.key}.title`)
                const num = String(index + 1).padStart(2, '0')

                return (
                  <li key={service.key}>
                    {service.ready ? (
                      <Link href={href} className="blocks-site__service-link">
                        <span className="blocks-site__service-link-num" aria-hidden="true">
                          {num}
                        </span>
                        <span className="blocks-site__service-link-title">{title}</span>
                        <span className="blocks-site__service-link-arrow" aria-hidden="true">
                          ↗
                        </span>
                      </Link>
                    ) : (
                      <span className="blocks-site__service-link is-soon">
                        <span className="blocks-site__service-link-num" aria-hidden="true">
                          {num}
                        </span>
                        <span className="blocks-site__service-link-title">{title}</span>
                        <span className="blocks-site__service-link-soon">{tCommonRoot('soon')}</span>
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="blocks-site__panel" aria-labelledby="hiw-next-h">
            <div className="blocks-site__close-block">
              <div>
                <h2 id="hiw-next-h">{t('nextStep.title')}</h2>
                <p>{t('nextStep.description')}</p>
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
