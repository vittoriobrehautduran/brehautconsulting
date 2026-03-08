import { ReactNode } from 'react'
import { Space_Grotesk, Inter, Playfair_Display } from 'next/font/google'
import './[locale]/globals.css'
import GoogleTagManager from '@/components/analytics/GoogleTagManager'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || ''

// Debug: Log GTM_ID at build time (remove after verification)
if (process.env.NODE_ENV === 'development') {
  console.log('GTM_ID from env:', GTM_ID || 'NOT SET')
}

// Space Grotesk - modern, technical font with character (for headings)
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

// Playfair Display - elegant serif with technical edge (for title)
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${playfairDisplay.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-black font-sans antialiased text-white overflow-x-hidden">
        <GoogleTagManager gtmId={GTM_ID} />
        {children}
      </body>
    </html>
  )
}

