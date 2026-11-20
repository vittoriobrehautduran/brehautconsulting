import HomeBlocksScroll from '@/components/blocks/HomeBlocksScroll'
import BlocksHomeSections from '@/components/blocks/BlocksHomeSections'
import BlocksFooter from '@/components/blocks/BlocksFooter'
import BlocksStyles from '@/components/blocks/BlocksStyles'

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
