import type { Metadata } from 'next'
import HomeBlocksScroll from '@/components/blocks/HomeBlocksScroll'
import BlocksHomeSections from '@/components/blocks/BlocksHomeSections'
import BlocksFooter from '@/components/blocks/BlocksFooter'
import BlocksStyles from '@/components/blocks/BlocksStyles'
import { buildPageMetadata } from '@/lib/seo/pageMetadata'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata(locale, 'home', '/')
}

// Live homepage — scroll hero + about / services / FAQ.
export default function HomePage() {
  return (
    <>
      <BlocksStyles />
      <HomeBlocksScroll />
      <BlocksHomeSections />
      <BlocksFooter />
    </>
  )
}
