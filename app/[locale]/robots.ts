// Robots.txt configuration

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/*/admin', '/*/booking', '/*/blocks', '/*/redesign'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

