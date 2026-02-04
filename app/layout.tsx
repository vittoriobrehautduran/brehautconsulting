import { ReactNode } from 'react'
import { Rajdhani, Inter, Frank_Ruhl_Libre, Cormorant } from 'next/font/google'
import './[locale]/globals.css'
import GoogleTagManager from '@/components/analytics/GoogleTagManager'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || ''

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const frankRuhlLibre = Frank_Ruhl_Libre({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-frank-ruhl-libre',
  display: 'swap',
})

// Canela font - using Cormorant as a similar elegant serif substitute
// Cormorant is very similar to Canela in style (elegant, refined serif)
const canela = Cormorant({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-canela',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${inter.variable} ${frankRuhlLibre.variable} ${canela.variable}`}>
      <body className="min-h-screen bg-black font-sans antialiased text-white overflow-x-hidden">
        <GoogleTagManager gtmId={GTM_ID} />
        {children}
      </body>
    </html>
  )
}

