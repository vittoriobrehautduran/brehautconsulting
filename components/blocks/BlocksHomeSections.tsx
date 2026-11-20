'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { SERVICE_PAGES, sitePath } from '@/components/blocks/serviceRoutes'

type FaqItem = { question: string; answer: string }

// Home content below the scroll hero — about, services, FAQ. No scroll-lock here.
export default function BlocksHomeSections() {
  const t = useTranslations('home')
  const tServices = useTranslations('home.services')
  const tAbout = useTranslations('home.about')
  const tFaq = useTranslations('home.faq')
  const tCta = useTranslations('home.cta')
  const tCommon = useTranslations('common.buttons')
  const tCommonRoot = useTranslations('common')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqItems = (tFaq.raw('items') as FaqItem[]) || []

  return (
    <div className="blocks-site">
      <section className="blocks-site__section blocks-site__section--about" id="about" aria-labelledby="blocks-about-h">
        <div className="blocks-site__wrap blocks-site__about">
          <div className="blocks-site__about-copy">
            <h2 id="blocks-about-h">{tAbout('title')}</h2>
            <p className="blocks-site__about-lede">{tAbout('description1')}</p>
            <p>{tAbout('description2')}</p>
            <Link className="blocks-site__ghost" href={sitePath('how-it-works')}>
              {tCommon('viewServices')}
            </Link>
          </div>
          <figure className="blocks-site__about-photo">
            <div className="blocks-site__about-frame">
              {/* Looping product clip — muted autoplay webm (lighter/sharper than a GIF). */}
              <video
                className="blocks-site__about-video"
                src="/media/about/loop.webm"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
            </div>
          </figure>
        </div>
      </section>

      <section className="blocks-site__section" id="services" aria-labelledby="blocks-services-h">
        <div className="blocks-site__wrap">
          <div className="blocks-site__head">
            <h2 id="blocks-services-h">{tServices('title')}</h2>
            <p>{t('hero.tagline')}</p>
          </div>

          {/* Same numbered service links as How it works — each opens its page. */}
          <ul className="blocks-site__service-links">
            {SERVICE_PAGES.map((service, index) => {
              const href = sitePath('services', service.slug)
              const title = tServices(`${service.key}.title`)
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

          <div className="blocks-site__strip">
            <p>{tCta('description')}</p>
            <div className="blocks-site__actions">
              <Link className="blocks-scroll__cta blocks-scroll__cta--solid" href={sitePath('contact')}>
                {tCommon('contactUs')}
              </Link>
              <Link className="blocks-site__ghost" href={sitePath('how-it-works')}>
                {tCommon('viewServices')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="blocks-site__section" id="faq" aria-labelledby="blocks-faq-h">
        <div className="blocks-site__wrap">
          <div className="blocks-site__head">
            <h2 id="blocks-faq-h">{tFaq('title')}</h2>
          </div>

          <ul className="blocks-site__faq">
            {faqItems.map((faq, index) => {
              const isOpen = openFaq === index
              const triggerId = `blocks-faq-trigger-${index}`
              const panelId = `blocks-faq-panel-${index}`

              return (
                <li key={faq.question} className={isOpen ? 'is-open' : undefined}>
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <span className="blocks-site__faq-icon" aria-hidden="true">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    hidden={!isOpen}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </div>
  )
}
