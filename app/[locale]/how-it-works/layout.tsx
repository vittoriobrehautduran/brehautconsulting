// Layout for how-it-works page with metadata

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'Comprehensive digital solutions including web development, conversion optimization, SEO, advertising, analytics, and technical integrations. Learn how we work.',
  keywords: [
    'web development services',
    'conversion optimization',
    'SEO services',
    'digital marketing',
    'web application development',
    'technical integrations',
    'analytics services',
    'advertising services',
  ],
  openGraph: {
    title: 'How It Works | Brehaut Consulting',
    description: 'Comprehensive digital solutions designed to drive real business results.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'How It Works | Brehaut Consulting',
    description: 'Comprehensive digital solutions designed to drive real business results.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'}/how-it-works`,
  },
}

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}




