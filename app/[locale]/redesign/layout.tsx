import type { ReactNode } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Homepage redesign (preview) | Brehaut Consulting',
  robots: { index: false, follow: false },
}

// Preview shell: hide the live site Header/Footer chrome only.
// Keep the redesign's own <footer class="closing"> visible.
export default function RedesignPreviewLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        body header.fixed {
          display: none !important;
        }
        body footer:not(.closing) {
          display: none !important;
        }
        main.relative {
          background: #000 !important;
          min-height: 100svh;
          padding: 0 !important;
        }
        /* Beat taste system.css fixed screen heights on this preview */
        .taste-redesign main > section.section,
        .taste-redesign main > .section,
        .taste-redesign footer.closing {
          --h: 1;
          height: auto !important;
          min-height: 0 !important;
          max-height: none !important;
          overflow: visible !important;
        }
        .taste-redesign main > section.section > .wrap,
        .taste-redesign footer.closing > .wrap {
          height: auto !important;
          flex: none !important;
        }
      `}</style>
      {children}
    </>
  )
}
