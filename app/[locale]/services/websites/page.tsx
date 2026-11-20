import type { Metadata } from 'next'
import BlocksServiceWebsites from '@/components/blocks/BlocksServiceWebsites'
import BlocksStyles from '@/components/blocks/BlocksStyles'
import { buildPageMetadata } from '@/lib/seo/pageMetadata'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata(locale, 'services.websites', '/services/websites')
}

export default function ServiceWebsitesPage() {
  return (
    <>
      <BlocksStyles />
      <BlocksServiceWebsites />
    </>
  )
}
