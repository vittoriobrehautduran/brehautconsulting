import type { Metadata } from 'next'
import BlocksServiceAds from '@/components/blocks/BlocksServiceAds'
import BlocksStyles from '@/components/blocks/BlocksStyles'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildPageMetadata } from '@/lib/seo/pageMetadata'
import JsonLd from '@/components/schema/JsonLd'
import { serviceSchema } from '@/lib/schema/jsonld'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata(locale, 'services.ads', '/services/ads')
}

export default async function ServiceAdsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'seo.pages.services.ads' })

  return (
    <>
      <JsonLd
        data={serviceSchema({
          locale,
          slug: 'ads',
          name: t('title'),
          description: t('description'),
        })}
      />
      <BlocksStyles />
      <BlocksServiceAds />
    </>
  )
}
