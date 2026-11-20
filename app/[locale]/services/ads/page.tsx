import type { Metadata } from 'next'
import BlocksServiceAds from '@/components/blocks/BlocksServiceAds'
import BlocksStyles from '@/components/blocks/BlocksStyles'
import { buildPageMetadata } from '@/lib/seo/pageMetadata'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata(locale, 'services.ads', '/services/ads')
}

export default function ServiceAdsPage() {
  return (
    <>
      <BlocksStyles />
      <BlocksServiceAds />
    </>
  )
}
