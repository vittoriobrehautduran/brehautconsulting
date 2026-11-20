// Self-hosted at build time by next/font — no request to Google from the browser.
import { Albert_Sans, Playfair_Display } from 'next/font/google'

export const albertSans = Albert_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-albert',
  display: 'swap',
})

export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-playfair',
  display: 'swap',
})

export const fontClassName = `${albertSans.variable} ${playfairDisplay.variable}`
