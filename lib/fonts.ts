// Self-hosted at build time by next/font — no request to Google from the browser.
// Geist for all text, Geist Mono for small technical details (numbers, labels),
// Playfair only for the "Brehaut Consulting" wordmark.
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'

export const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-geist',
  display: 'swap',
})

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-playfair',
  display: 'swap',
})

export const fontClassName = `${geist.variable} ${geistMono.variable} ${playfairDisplay.variable}`
