// JSON-LD Schema Markup Generator
// Generates structured data for SEO

import { CONTACT_EMAIL, CONTACT_PHONE, COMPANY_TAGLINE } from '@/lib/constants'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'

export interface OrganizationSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  url: string
  logo: string
  contactPoint: {
    '@type': string
    contactType: string
    email: string
    telephone: string
    availableLanguage: string[]
  }
  areaServed: string[]
  sameAs?: string[]
}

export interface ServiceSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  provider: {
    '@type': string
    name: string
  }
  serviceType: string
  areaServed: string[]
  availableChannel: {
    '@type': string
    serviceUrl: string
  }
}

export interface WebSiteSchema {
  '@context': string
  '@type': string
  name: string
  url: string
  inLanguage: string[]
  potentialAction?: {
    '@type': string
    target: {
      '@type': string
      urlTemplate: string
    }
    'query-input': string
  }
}

export interface FAQPageSchema {
  '@context': string
  '@type': string
  mainEntity: Array<{
    '@type': string
    name: string
    acceptedAnswer: {
      '@type': string
      text: string
    }
  }>
}

export interface BreadcrumbListSchema {
  '@context': string
  '@type': string
  itemListElement: Array<{
    '@type': string
    position: number
    name: string
    item: string
  }>
}

export interface EventSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  organizer: {
    '@type': string
    name: string
    url: string
  }
  offers: {
    '@type': string
    price: string
    priceCurrency: string
  }
  eventAttendanceMode: string
  eventStatus: string
}

// Generate Organization Schema
export function generateOrganizationSchema(locale: string = 'en'): OrganizationSchema {
  const description = locale === 'sv' 
    ? 'Tydliga, mätbara digitala system för kundtillväxt. Vi hjälper små och medelstora företag få fler kunder genom högpresterande webbplatser, sökbarhet och mätbara digitala marknadsföringssystem.'
    : 'Clear, measurable digital systems for customer growth. We help small and medium-sized businesses get more customers through high-performance websites, search visibility, and measurable digital marketing systems.'

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Brehaut Consulting',
    description,
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo_favicon.svg`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE,
      availableLanguage: ['English', 'Swedish', 'Spanish'],
    },
    areaServed: ['Europe', 'Latin America'],
  }
}

// Generate Service Schema
export function generateServiceSchema(
  name: string,
  description: string,
  locale: string = 'en'
): ServiceSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: 'Brehaut Consulting',
    },
    serviceType: 'Technology and Growth Consultancy',
    areaServed: ['Europe', 'Latin America'],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${BASE_URL}/${locale}/booking`,
    },
  }
}

// Generate WebSite Schema
export function generateWebSiteSchema(locale: string = 'en'): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Brehaut Consulting',
    url: BASE_URL,
    inLanguage: ['en', 'sv'],
  }
}

// Generate FAQPage Schema
export function generateFAQPageSchema(
  faqItems: Array<{ question: string; answer: string }>
): FAQPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

// Generate BreadcrumbList Schema
export function generateBreadcrumbListSchema(
  items: Array<{ name: string; url: string }>
): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Generate Event Schema for Booking Page
export function generateEventSchema(locale: string = 'en'): EventSchema {
  const name = locale === 'sv' 
    ? 'Boka ett möte'
    : 'Book a Consultation'
  
  const description = locale === 'sv'
    ? 'Boka ett kostnadsfritt konsultationsmöte för att diskutera dina affärsmål och hur vi kan hjälpa dig växa.'
    : 'Book a free consultation meeting to discuss your business goals and how we can help you grow.'

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    organizer: {
      '@type': 'Organization',
      name: 'Brehaut Consulting',
      url: BASE_URL,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'SEK',
    },
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
  }
}

