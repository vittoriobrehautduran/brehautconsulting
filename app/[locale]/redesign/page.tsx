import HomeHeroRedesign from '@/components/redesign/HomeHeroRedesign'
import Script from 'next/script'

// Separate full-page redesign preview. Live homepage at /[locale] is unchanged.
export default function RedesignPreviewPage() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;600&family=Playfair+Display:wght@600&display=swap"
      />
      <link rel="stylesheet" href="/taste/system.css" />
      <link rel="stylesheet" href="/taste/layout.css" />
      <link rel="stylesheet" href="/taste/motion.css" />
      <link rel="stylesheet" href="/taste/redesign-scope.css" />
      <HomeHeroRedesign />
      <Script src="/taste/system.js" type="module" strategy="afterInteractive" />
      <Script src="/taste/layout.js" type="module" strategy="afterInteractive" />
      <Script src="/taste/motion.js" type="module" strategy="afterInteractive" />
    </>
  )
}
