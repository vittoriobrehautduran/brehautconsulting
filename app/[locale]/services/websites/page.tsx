import type { Metadata } from 'next'
import BlocksServiceWebsites from '@/components/blocks/BlocksServiceWebsites'
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
  return buildPageMetadata(locale, 'services.websites', '/services/websites')
}

export default async function ServiceWebsitesPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'seo.pages.services.websites' })

  return (
    <>
      <JsonLd
        data={serviceSchema({
          locale,
          slug: 'websites',
          name: t('title'),
          description: t('description'),
        })}
      />
      <BlocksStyles />
      <BlocksServiceWebsites />
    </>
  )
}
