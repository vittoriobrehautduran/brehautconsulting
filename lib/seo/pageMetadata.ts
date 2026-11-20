import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'

// Branded 1200×630 link-preview image, one per language.
export const ogImage = (locale: string) =>
  `/media/og/og-${['en', 'sv', 'es'].includes(locale) ? locale : 'en'}.jpg`

export const ogImages = (locale: string) => [
  { url: ogImage(locale), width: 1200, height: 630, alt: 'Brehaut Consulting' },
]

// Open Graph wants language_TERRITORY codes.
export const OG_LOCALES: Record<string, string> = {
  en: 'en_US',
  sv: 'sv_SE',
  es: 'es_ES',
}

type PageKey =
  | 'home'
  | 'contact'
  | 'howItWorks'
  | 'services.websites'
  | 'services.seo'
  | 'services.ads'
  | 'services.analytics'
  | 'services.automation'
  | 'privacy'

// Build locale-aware metadata for a public site page.
export async function buildPageMetadata(
  locale: string,
  pageKey: PageKey,
  path: string
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'seo.pages' })
  const title = t(`${pageKey}.title`)
  const description = t(`${pageKey}.description`)
  const normalized = path === '/' ? '' : path.replace(/\/$/, '')
  const canonicalPath = normalized ? `/${locale}${normalized}` : `/${locale}`
  const canonical = `${SITE_URL}${canonicalPath}`

  const languages: Record<string, string> = {}
  for (const loc of locales) {
    languages[loc] = normalized
      ? `${SITE_URL}/${loc}${normalized}`
      : `${SITE_URL}/${loc}`
  }
  languages['x-default'] = normalized
    ? `${SITE_URL}/en${normalized}`
    : `${SITE_URL}/en`

  return {
    // The layout's "%s | Brehaut Consulting" template only applies to child
    // segments, not to the home page (same segment), so spell it out there.
    title: pageKey === 'home' ? { absolute: `${title} | Brehaut Consulting` } : title,
    description,
    openGraph: {
      title: `${title} | Brehaut Consulting`,
      description,
      type: 'website',
      url: canonical,
      locale: OG_LOCALES[locale] ?? 'en_US',
      alternateLocale: locales
        .filter((loc) => loc !== locale)
        .map((loc) => OG_LOCALES[loc]),
      images: ogImages(locale),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Brehaut Consulting`,
      description,
      images: [ogImage(locale)],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical,
      languages,
    },
  }
}
