// Locale-specific layout

import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
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
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'
    ),
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
          url: '/media/hero/scroll_stills/stop_1.jpg',
          width: 1280,
          height: 720,
          alt: 'Brehaut Consulting',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.openGraph.title,
      description: metadata.openGraph.description,
      images: ['/media/hero/scroll_stills/stop_1.jpg'],
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'}/${locale}`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'}/en`,
        sv: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'}/sv`,
        es: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'}/es`,
        'x-default': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'}/en`,
      },
    },
    icons: {
      icon: [
        {
          url: '/media/brand/favicon/favicon.svg?v=20261120',
          type: 'image/svg+xml',
        },
        {
          url: '/media/brand/favicon/favicon.ico?v=20261120',
          sizes: 'any',
        },
        {
          url: '/media/brand/favicon/favicon-96x96.png?v=20261120',
          sizes: '96x96',
          type: 'image/png',
        },
      ],
      shortcut: [
        {
          url: '/media/brand/favicon/favicon.ico?v=20261120',
          sizes: 'any',
        },
      ],
      apple: '/media/brand/favicon/apple-touch-icon.png?v=20261120',
      other: [
        {
          rel: 'android-chrome-192x192',
          url: '/media/brand/favicon/web-app-manifest-192x192.png?v=20261120',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          rel: 'android-chrome-512x512',
          url: '/media/brand/favicon/web-app-manifest-512x512.png?v=20261120',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    manifest: '/media/brand/favicon/site.webmanifest',
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages({ locale })

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      {/* Hide legacy Tailwind chrome if anything still renders it. */}
      <style>{`
        body header.fixed {
          display: none !important;
        }
        body footer:not(.blocks-site__footer) {
          display: none !important;
        }
        main.relative {
          background: #000 !important;
          min-height: 100svh;
          padding: 0 !important;
        }
      `}</style>
      <NextIntlClientProvider messages={messages}>
        <main className="relative bg-transparent">{children}</main>
      </NextIntlClientProvider>
    </>
  )
}
