import type { Metadata } from 'next'
import BlocksServiceAutomation from '@/components/blocks/BlocksServiceAutomation'
import BlocksStyles from '@/components/blocks/BlocksStyles'
import { buildPageMetadata } from '@/lib/seo/pageMetadata'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata(locale, 'services.automation', '/services/automation')
}

export default function ServiceAutomationPage() {
  return (
    <>
      <BlocksStyles />
      <BlocksServiceAutomation />
    </>
  )
}
