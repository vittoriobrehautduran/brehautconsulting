import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import BlocksNotFound from '@/components/blocks/BlocksNotFound'
import BlocksStyles from '@/components/blocks/BlocksStyles'
import CookieConsent from '@/components/consent/CookieConsent'
import { consentDefaultsScript } from '@/components/consent/consentDefaults'
import { fontClassName } from '@/lib/fonts'

// Localized 404 for every unknown URL.
//
// Lives at the root (not in app/[locale]) on purpose: in Next 14 a 404 from an
// unmatched route is fully server-rendered, whereas notFound() thrown inside a
// page only sends an empty shell that the browser fills in after JS loads.
// The middleware sends /foo → /en/foo, so the locale comes from its header.
// The root layout renders no <html>, so this page provides its own.

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('notFound')
  return {
    title: `${t('title')} | Brehaut Consulting`,
    robots: { index: false, follow: true },
  }
}

export default async function NotFound() {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className={fontClassName}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: consentDefaultsScript }} />
      </head>
      <body className="min-h-screen bg-black font-sans antialiased text-white overflow-x-hidden">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <BlocksStyles />
          <div className="site-root">
            <BlocksNotFound />
          </div>
          <CookieConsent gtmId={process.env.NEXT_PUBLIC_GTM_ID || ''} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
