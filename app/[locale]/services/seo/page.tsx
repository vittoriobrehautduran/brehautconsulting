import type { Metadata } from 'next'
import BlocksServiceSeo from '@/components/blocks/BlocksServiceSeo'
import BlocksStyles from '@/components/blocks/BlocksStyles'
import { getTranslations } from 'next-intl/server'
import { buildPageMetadata } from '@/lib/seo/pageMetadata'
import JsonLd from '@/components/schema/JsonLd'
import { serviceSchema } from '@/lib/schema/jsonld'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata(locale, 'services.seo', '/services/seo')
}

export default async function ServiceSeoPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.pages.services.seo' })

  return (
    <>
      <JsonLd
        data={serviceSchema({
          locale,
          slug: 'seo',
          name: t('title'),
          description: t('description'),
        })}
      />
      <BlocksStyles />
      <BlocksServiceSeo />
    </>
  )
}
