'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/constants'

// Lazy load GSAP to reduce initial bundle size
let gsap: any = null
let ScrollTrigger: any = null

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const t = useTranslations('common.footer')
  const [gsapLoaded, setGsapLoaded] = useState(false)

  // Lazy load GSAP after initial render
  useEffect(() => {
    const loadGSAP = async () => {
      const gsapModule = await import('gsap')
      const scrollTriggerModule = await import('gsap/ScrollTrigger')
      gsap = gsapModule.gsap
      ScrollTrigger = scrollTriggerModule.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)
      setGsapLoaded(true)
    }
    const timer = setTimeout(() => {
      loadGSAP()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!gsapLoaded || !footerRef.current) return
    
      gsap.fromTo(
        footerRef.current,
        {
          y: 30,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
          immediateRender: false,
        }
      )
  }, [gsapLoaded])

  return (
    <footer
      ref={footerRef}
      className="border-t border-white/10 bg-black/90 backdrop-blur-sm py-12 px-6 relative z-10"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-4">{t('contactUs')}</h3>
            <p className="text-white/70 mb-4">{t('emailDescription')}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-white/90 hover:text-white transition-colors flex items-center gap-2 group mb-3 block"
            >
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>{CONTACT_EMAIL}</span>
            </a>
            <a
              href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}
              className="text-white/90 hover:text-white transition-colors flex items-center gap-2 group block"
            >
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>{CONTACT_PHONE}</span>
            </a>
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-4">{t('location')}</h3>
            <p className="text-white/70">{t('servingClients')}</p>
            <p className="text-white/90 mt-2">{t('regions')}</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-white/70">
          <p>&copy; 2025 Brehaut Consulting. {t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}

