// Locale-specific layout

import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import JsonLd from '@/components/schema/JsonLd'
import CookieConsent from '@/components/consent/CookieConsent'
import { organizationSchema, webSiteSchema } from '@/lib/schema/jsonld'
import { fontClassName } from '@/lib/fonts'
import { OG_LOCALES } from '@/lib/seo/pageMetadata'
import { consentDefaultsScript } from '@/components/consent/consentDefaults'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || ''

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
      locale: OG_LOCALES[locale] ?? 'en_US',
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
  const t = await getTranslations({ locale, namespace: 'seo.pages.home' })

  return (
    <html
      lang={locale}
      className={fontClassName}
    >
      <head>
        {/* Consent Mode v2 defaults: everything denied until the visitor
            accepts in the cookie banner. GTM itself is only loaded after
            consent (see CookieConsent). */}
        <script dangerouslySetInnerHTML={{ __html: consentDefaultsScript }} />
      </head>
      <body className="min-h-screen bg-black font-sans antialiased text-white overflow-x-hidden">
        <JsonLd
          data={[
            organizationSchema(locale, t('description')),
            webSiteSchema(locale),
          ]}
        />
        <NextIntlClientProvider messages={messages}>
          <div className="site-root">{children}</div>
          <CookieConsent gtmId={GTM_ID} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
