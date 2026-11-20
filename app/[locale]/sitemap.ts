// Dynamic sitemap — all locales and public routes.

import { MetadataRoute } from 'next'
import { locales } from '@/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'

  const paths = [
    '',
    '/how-it-works',
    '/contact',
    '/services/websites',
    '/services/seo',
    '/services/ads',
    '/services/analytics',
    '/services/automation',
  ] as const

  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const path of paths) {
      const isHome = path === ''
      entries.push({
        url: isHome ? `${baseUrl}/${locale}` : `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '/contact' ? 'weekly' : 'monthly',
        priority: isHome ? 1 : path.startsWith('/services') ? 0.8 : 0.9,
      })
    }
  }

  return entries
}
