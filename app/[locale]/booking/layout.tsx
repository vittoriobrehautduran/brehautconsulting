// Layout for booking page with metadata

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Meeting',
  description: 'Book a consultation meeting with Brehaut Consulting to discuss your technology and growth needs. Available Monday-Thursday.',
  keywords: [
    'book consultation',
    'schedule meeting',
    'technology consultation',
    'growth consultancy booking',
  ],
  openGraph: {
    title: 'Book a Meeting | Brehaut Consulting',
    description: 'Book a consultation meeting with Brehaut Consulting to discuss your technology and growth needs.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Book a Meeting | Brehaut Consulting',
    description: 'Book a consultation meeting with Brehaut Consulting.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'}/booking`,
  },
}

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

