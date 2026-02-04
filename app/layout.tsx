import { ReactNode } from 'react'
import { Rajdhani, Inter, Frank_Ruhl_Libre, Cormorant } from 'next/font/google'
import Script from 'next/script'
import './[locale]/globals.css'

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
        {/* Google Tag Manager */}
        {GTM_ID && (
          <>
            <Script
              id="gtm-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${GTM_ID}');
                `,
              }}
            />
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>
          </>
        )}
        {children}
      </body>
    </html>
  )
}

