import type { Metadata } from 'next'
import HomeBlocksScroll from '@/components/blocks/HomeBlocksScroll'
import BlocksHomeSections from '@/components/blocks/BlocksHomeSections'
import BlocksFooter from '@/components/blocks/BlocksFooter'
import BlocksStyles from '@/components/blocks/BlocksStyles'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildPageMetadata } from '@/lib/seo/pageMetadata'
import JsonLd from '@/components/schema/JsonLd'
import { faqPageSchema } from '@/lib/schema/jsonld'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata(locale, 'home', '/')
}

// Live homepage — scroll hero + about / services / FAQ.
export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const tFaq = await getTranslations({ locale, namespace: 'home.faq' })
  const faqItems = tFaq.raw('items') as Array<{ question: string; answer: string }>

  return (
    <>
      <JsonLd data={faqPageSchema(faqItems)} />
      <BlocksStyles />
      <HomeBlocksScroll />
      <BlocksHomeSections />
      <BlocksFooter />
    </>
  )
}
