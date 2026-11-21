import { setRequestLocale } from 'next-intl/server'
import BlocksContact from '@/components/blocks/BlocksContact'
import BlocksStyles from '@/components/blocks/BlocksStyles'

type Props = { params: Promise<{ locale: string }> }

// setRequestLocale lets next-intl render this page statically at build time.
export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <BlocksStyles />
      <BlocksContact />
    </>
  )
}
