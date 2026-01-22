// Root layout with Tailwind CSS

import type { Metadata, Viewport } from 'next'
import { Rajdhani, Inter, Frank_Ruhl_Libre } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { COMPANY_TAGLINE } from '@/lib/constants'
import './globals.css'

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const frankRuhlLibre = Frank_Ruhl_Libre({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-frank-ruhl-libre',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'),
  title: {
    default: 'Brehaut Consulting | Technology & Growth Consultancy',
    template: '%s | Brehaut Consulting',
  },
  description: COMPANY_TAGLINE,
  keywords: [
    'technology consultancy',
    'growth consultancy',
    'web development',
    'digital systems',
    'conversion optimisation',
    'SEO',
    'analytics',
    'automation',
    'digital marketing',
    'web applications',
    'technical integrations',
    'local visibility',
    'advertising',
    'measurement',
  ],
  authors: [{ name: 'Brehaut Consulting' }],
  creator: 'Brehaut Consulting',
  publisher: 'Brehaut Consulting',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com',
    siteName: 'Brehaut Consulting',
    title: 'Brehaut Consulting | Technology & Growth Consultancy',
    description: COMPANY_TAGLINE,
    images: [
      {
        url: '/images/logo_favicon.svg',
        width: 1200,
        height: 630,
        alt: 'Brehaut Consulting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brehaut Consulting | Technology & Growth Consultancy',
    description: COMPANY_TAGLINE,
    images: ['/images/logo_favicon.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com',
  },
  icons: {
    icon: [
      { url: '/images/logo_favicon.svg', type: 'image/svg+xml' },
      { url: '/images/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: [
      { url: '/images/logo_favicon.svg', type: 'image/svg' },
      { url: '/images/logo_favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/images/favicon/apple-touch-icon.png',
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/images/favicon/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/images/favicon/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${inter.variable} ${frankRuhlLibre.variable}`}>
      <body className="min-h-screen bg-black font-sans antialiased text-white overflow-x-hidden">
          <Header />
        <main className="relative bg-transparent">{children}</main>
          <Footer />
      </body>
    </html>
  )
}
