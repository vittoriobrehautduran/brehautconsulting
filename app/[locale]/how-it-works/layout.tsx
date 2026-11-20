import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/pageMetadata'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata(locale, 'howItWorks', '/how-it-works')
}

export default function HowItWorksLayout({ children }: Props) {
  return children
}
