import type { Metadata } from 'next'
import LocalizedNotFound from '@/components/blocks/LocalizedNotFound'
import BlocksStyles from '@/components/blocks/BlocksStyles'
import { consentDefaultsScript } from '@/components/consent/consentDefaults'
import { fontClassName } from '@/lib/fonts'
import messages from '@/messages/en.json'
import sv from '@/messages/sv.json'
import es from '@/messages/es.json'

// Localized 404 for every unknown URL (the middleware sends /foo → /en/foo).
//
// Lives at the root on purpose: a 404 from an unmatched route is fully
// server-rendered, whereas notFound() thrown inside a page only sends an empty
// shell that the browser fills in after JS loads.
//
// Must not read request headers (no getLocale()): Next renders this file as
// part of every page, and any headers() call here makes the whole site
// dynamic, so Netlify can't cache pages. So the server renders English and
// LocalizedNotFound switches to the URL's language in the browser.
// The root layout renders no <html>, so this page provides its own.

export const metadata: Metadata = {
  title: `${messages.notFound.title} | Brehaut Consulting`,
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <html lang="en" className={fontClassName}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: consentDefaultsScript }} />
      </head>
      <body className="min-h-screen bg-black font-sans antialiased text-white overflow-x-hidden">
        <BlocksStyles />
        <div className="site-root">
          <LocalizedNotFound messages={{ en: messages, sv, es }} />
        </div>
      </body>
    </html>
  )
}
