// Served at /sitemap.xml — every public page in every locale, with hreflang alternates.

import { MetadataRoute } from 'next'
import { locales } from '@/i18n'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'

const PAGES: Array<{ path: string; priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' }> = [
  { path: '', priority: 1, changeFrequency: 'monthly' },
  { path: '/how-it-works', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/services/websites', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services/seo', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services/ads', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services/analytics', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services/automation', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
]

const url = (locale: string, path: string) => `${baseUrl}/${locale}${path}`

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return locales.flatMap((locale) =>
    PAGES.map(({ path, priority, changeFrequency }) => ({
      url: url(locale, path),
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, url(l, path)])),
      },
    }))
  )
}
