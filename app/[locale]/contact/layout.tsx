import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Tell us about your project. We will get back to you with next steps — no calendar booking required.',
  openGraph: {
    title: 'Contact | Brehaut Consulting',
    description:
      'Tell us about your project. We will get back to you with next steps.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'}/contact`,
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
