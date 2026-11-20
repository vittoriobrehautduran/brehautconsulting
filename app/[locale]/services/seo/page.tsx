import type { Metadata } from 'next'
import BlocksServiceSeo from '@/components/blocks/BlocksServiceSeo'
import BlocksStyles from '@/components/blocks/BlocksStyles'
import { buildPageMetadata } from '@/lib/seo/pageMetadata'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata(locale, 'services.seo', '/services/seo')
}

export default function ServiceSeoPage() {
  return (
    <>
      <BlocksStyles />
      <BlocksServiceSeo />
    </>
  )
}
