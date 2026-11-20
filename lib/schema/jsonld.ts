// JSON-LD structured data (schema.org) for search engines.

import { CONTACT_EMAIL, CONTACT_PHONE, COMPANY_NAME } from '@/lib/constants'
import { locales } from '@/i18n'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'
const ORG_ID = `${BASE_URL}/#organization`
const SITE_ID = `${BASE_URL}/#website`

// The business itself. Rendered once per page from the locale layout.
export function organizationSchema(locale: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': ORG_ID,
    name: COMPANY_NAME,
    description,
    url: `${BASE_URL}/${locale}`,
    logo: `${BASE_URL}/media/brand/logo-favicon-256.png`,
    image: `${BASE_URL}/media/hero/scroll_stills/stop_1.jpg`,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE.replace(/\s/g, ''),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE.replace(/\s/g, ''),
      availableLanguage: ['English', 'Swedish', 'Spanish'],
    },
    areaServed: ['Europe', 'Latin America'],
  }
}

export function webSiteSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: COMPANY_NAME,
    url: BASE_URL,
    inLanguage: locale,
    availableLanguage: [...locales],
    publisher: { '@id': ORG_ID },
  }
}

// Mirrors the FAQ shown on the home page — must stay identical to visible text.
export function faqPageSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

// One service page.
export function serviceSchema(opts: {
  locale: string
  slug: string
  name: string
  description: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: `${BASE_URL}/${opts.locale}/services/${opts.slug}`,
    provider: { '@id': ORG_ID },
    areaServed: ['Europe', 'Latin America'],
  }
}
