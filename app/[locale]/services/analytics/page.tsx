import type { Metadata } from 'next'
import BlocksServiceAnalytics from '@/components/blocks/BlocksServiceAnalytics'
import BlocksStyles from '@/components/blocks/BlocksStyles'
import { buildPageMetadata } from '@/lib/seo/pageMetadata'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata(locale, 'services.analytics', '/services/analytics')
}

export default function ServiceAnalyticsPage() {
  return (
    <>
      <BlocksStyles />
      <BlocksServiceAnalytics />
    </>
  )
}
