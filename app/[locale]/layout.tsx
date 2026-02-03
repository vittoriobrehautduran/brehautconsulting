// Locale-specific layout

import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { locales } from '@/i18n'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const messages = await getMessages({ locale })
  const metadata = messages.metadata as any

  const localeMap: Record<string, string> = {
    en: 'en_US',
    sv: 'sv_SE',
  }

  return {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'),
  title: {
      default: metadata.title,
      template: metadata.titleTemplate,
  },
    description: metadata.description,
    keywords: metadata.keywords,
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
      locale: localeMap[locale] || 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com',
      siteName: metadata.openGraph.siteName,
      title: metadata.openGraph.title,
      description: metadata.openGraph.description,
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
      title: metadata.openGraph.title,
      description: metadata.openGraph.description,
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
        { url: '/images/favicon/favicon.svg', type: 'image/svg+xml' },
        { url: '/images/favicon/favicon.ico', sizes: 'any' },
        { url: '/images/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: [
        { url: '/images/favicon/favicon.ico', sizes: 'any' },
    ],
    apple: '/images/favicon/apple-touch-icon.png',
    other: [
      {
        rel: 'android-chrome-192x192',
          url: '/images/favicon/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'android-chrome-512x512',
          url: '/images/favicon/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
    manifest: '/images/favicon/site.webmanifest',
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale })

  return (
    <>
      {/* Preconnect to improve font loading */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <NextIntlClientProvider messages={messages}>
          <Header />
        <main className="relative bg-transparent">{children}</main>
          <Footer />
      </NextIntlClientProvider>
    </>
  )
}
