import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always show locale prefix in URL
  localePrefix: 'always',
})

export const config = {
  // Every page path, so unknown URLs like /foo get a locale and hit the
  // localized 404. Skips Next internals, Netlify functions and files with an
  // extension (robots.txt, sitemap.xml, images, ...).
  matcher: ['/((?!_next|\\.netlify|.*\\..*).*)'],
}
