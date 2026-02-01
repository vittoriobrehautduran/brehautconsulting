const withNextIntl = require('next-intl/plugin')(
  './i18n.ts'
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Optimize image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Modern browser targets - remove legacy JavaScript polyfills
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Modern JavaScript output - target modern browsers only
  swcMinify: true,
  // Explicitly target modern browsers to avoid legacy polyfills
  transpilePackages: [],
  // Output modern JavaScript (ES2020+)
  experimental: {
    // Use modern output format
    esmExternals: true,
  },
}

module.exports = withNextIntl(nextConfig)

