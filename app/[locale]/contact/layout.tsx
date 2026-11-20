import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/pageMetadata'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata(locale, 'contact', '/contact')
}

export default function ContactLayout({ children }: Props) {
  return children
}
