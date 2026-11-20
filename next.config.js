const withNextIntl = require('next-intl/plugin')(
  './i18n.ts'
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
  transpilePackages: [],
  experimental: {
    esmExternals: true,
  },
  async redirects() {
    return [
      {
        source: '/:locale(en|sv|es)/booking',
        destination: '/:locale/contact',
        permanent: true,
      },
      {
        source: '/:locale(en|sv|es)/blocks',
        destination: '/:locale',
        permanent: true,
      },
      {
        source: '/:locale(en|sv|es)/blocks/how-it-works',
        destination: '/:locale/how-it-works',
        permanent: true,
      },
      {
        source: '/:locale(en|sv|es)/blocks/contact',
        destination: '/:locale/contact',
        permanent: true,
      },
      {
        source: '/:locale(en|sv|es)/blocks/booking',
        destination: '/:locale/contact',
        permanent: true,
      },
      {
        source: '/:locale(en|sv|es)/blocks/services/:slug',
        destination: '/:locale/services/:slug',
        permanent: true,
      },
      {
        source: '/:locale(en|sv|es)/redesign',
        destination: '/:locale',
        permanent: true,
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)
