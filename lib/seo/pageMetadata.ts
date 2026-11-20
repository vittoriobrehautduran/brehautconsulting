import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'

const OG_IMAGE = '/media/hero/scroll_stills/stop_1.jpg'

type PageKey =
  | 'home'
  | 'contact'
  | 'howItWorks'
  | 'services.websites'
  | 'services.seo'
  | 'services.ads'
  | 'services.analytics'
  | 'services.automation'

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
    title,
    description,
    openGraph: {
      title: `${title} | Brehaut Consulting`,
      description,
      type: 'website',
      url: canonical,
      locale,
      images: [
        {
          url: OG_IMAGE,
          width: 1280,
          height: 720,
          alt: 'Brehaut Consulting',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Brehaut Consulting`,
      description,
      images: [OG_IMAGE],
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
