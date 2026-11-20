import type { Metadata } from 'next'
import BlocksServiceAutomation from '@/components/blocks/BlocksServiceAutomation'
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
  return buildPageMetadata(locale, 'services.automation', '/services/automation')
}

export default async function ServiceAutomationPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.pages.services.automation' })

  return (
    <>
      <JsonLd
        data={serviceSchema({
          locale,
          slug: 'automation',
          name: t('title'),
          description: t('description'),
        })}
      />
      <BlocksStyles />
      <BlocksServiceAutomation />
    </>
  )
}
