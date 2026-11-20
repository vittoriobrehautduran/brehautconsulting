// Live site routes for service pages and shared nav links.

export const BASE = ''
export const HOME = '/'

export const SERVICE_PAGES = [
  {
    key: 'service1',
    slug: 'websites',
    ready: true,
  },
  {
    key: 'service3',
    slug: 'seo',
    ready: true,
  },
  {
    key: 'service4',
    slug: 'ads',
    ready: true,
  },
  {
    key: 'service5',
    slug: 'analytics',
    ready: true,
  },
  {
    key: 'service6',
    slug: 'automation',
    ready: true,
  },
] as const

export type ServiceSlug = (typeof SERVICE_PAGES)[number]['slug']

// Build a site path from segments. Empty → home.
export function sitePath(...segments: string[]) {
  const path = segments.filter(Boolean).join('/')
  return path ? `/${path}` : HOME
}
