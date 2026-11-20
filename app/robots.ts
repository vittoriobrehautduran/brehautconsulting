// Served at /robots.txt

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/.netlify/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
