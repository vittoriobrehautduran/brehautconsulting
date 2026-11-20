import { ReactNode } from 'react'
import './[locale]/globals.css'

// <html> and <body> live in app/[locale]/layout.tsx so they can carry
// lang={locale}. This root layout only passes children through.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
