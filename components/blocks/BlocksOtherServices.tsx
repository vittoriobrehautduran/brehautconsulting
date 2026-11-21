'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { SERVICE_PAGES, sitePath } from '@/components/blocks/serviceRoutes'

// Bottom of each service page: links to the other services.
export default function BlocksOtherServices({ current }: { current: string }) {
  const tHome = useTranslations('home.services')
  const tBlocks = useTranslations('blocks')
  const others = SERVICE_PAGES.filter((service) => service.key !== current)

  return (
    <section className="blocks-site__panel" aria-labelledby="svc-other-h">
      <div className="blocks-site__panel-head">
        <h2 id="svc-other-h">{tBlocks('otherServices')}</h2>
      </div>
      <ul className="blocks-site__service-links">
        {others.map((service) => {
          const num = String(SERVICE_PAGES.indexOf(service) + 1).padStart(2, '0')
          return (
            <li key={service.key}>
              <Link
                href={sitePath('services', service.slug)}
                className="blocks-site__service-link"
              >
                <span className="blocks-site__service-link-num" aria-hidden="true">
                  {num}
                </span>
                <span className="blocks-site__service-link-title">
                  {tHome(`${service.key}.title`)}
                  <span className="blocks-site__service-link-sub">
                    {tHome(`${service.key}.subtitle`)}
                  </span>
                </span>
                <span className="blocks-site__service-link-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
