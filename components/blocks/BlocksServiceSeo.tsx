'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import BlocksNav from '@/components/blocks/BlocksNav'
import BlocksFooter from '@/components/blocks/BlocksFooter'
import { sitePath } from '@/components/blocks/serviceRoutes'
import BlocksServiceDetails from '@/components/blocks/BlocksServiceDetails'
import BlocksOtherServices from '@/components/blocks/BlocksOtherServices'

// Local Visibility & SEO service page for the /blocks redesign.
export default function BlocksServiceSeo() {
  const tHome = useTranslations('home.services.service3')
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

          <header className="blocks-site__page-intro" aria-labelledby="svc-seo-h">
            <h1 id="svc-seo-h">
              <span className="blocks-site__title-num" aria-hidden="true">
                02
              </span>
              {tHome('title')}
            </h1>
            <p>{tHome('description')}</p>
          </header>

          <BlocksServiceDetails serviceKey="service3" idPrefix="svc-seo" />

          <section className="blocks-site__panel" aria-labelledby="svc-seo-next">
            <div className="blocks-site__close-block">
              <div>
                <h2 id="svc-seo-next">{tBlocks(`serviceNext.service3.title`)}</h2>
                <p>{tBlocks(`serviceNext.service3.body`)}</p>
              </div>
              <Link
                className="blocks-scroll__cta blocks-scroll__cta--solid"
                href={sitePath('contact')}
              >
                {tCommon('contactUs')}
              </Link>
            </div>
          </section>

          <BlocksOtherServices current="service3" />
        </div>
      </main>

      <BlocksFooter />
    </div>
  )
}
