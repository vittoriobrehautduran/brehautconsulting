'use client'

import { useTranslations } from 'next-intl'

type Area = { title: string; body: string }

// Shared body for the service pages: what we do (explained) + what you get.
export default function BlocksServiceDetails({
  serviceKey,
  idPrefix,
}: {
  serviceKey: string
  idPrefix: string
}) {
  const t = useTranslations(`services.serviceDetails.${serviceKey}`)
  const areas = (t.raw('areas') as Area[]) || []
  const benefits = (t.raw('benefitsList') as string[]) || []

  return (
    <>
      <section className="blocks-site__panel" aria-labelledby={`${idPrefix}-do`}>
        <div className="blocks-site__panel-head">
          <h2 id={`${idPrefix}-do`}>{t('whatWeDo')}</h2>
        </div>
        <ul className="blocks-site__expect">
          {areas.map((area) => (
            <li key={area.title} className="blocks-site__card">
              <h3>{area.title}</h3>
              <p>{area.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="blocks-site__panel" aria-labelledby={`${idPrefix}-get`}>
        <div className="blocks-site__panel-head">
          <h2 id={`${idPrefix}-get`}>{t('benefits')}</h2>
        </div>
        <ul className="blocks-site__plain-list">
          {benefits.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </>
  )
}
