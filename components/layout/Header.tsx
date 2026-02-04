'use client'

import Image from 'next/image'
import { Link, usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = useTranslations('common.nav')

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      )
    }
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const isActive = (path: string) => {
    // pathname from next-intl navigation already excludes locale prefix
    return pathname === path || pathname === `${path}/`
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md bg-black/30 border-b border-white/10"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" onClick={closeMenu}>
            <Image
              src="/images/logo_cropped.png"
              alt="Brehaut Consulting Logo"
              width={40}
              height={40}
              priority
            />
            <span className="hidden md:inline text-xl font-canela font-bold text-white">
              Brehaut Consulting
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-base font-medium transition-colors ${
                isActive('/') 
                  ? 'text-white underline underline-offset-4 decoration-white' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {t('home')}
            </Link>
            <Link
              href="/how-it-works"
              className={`text-base font-medium transition-colors ${
                isActive('/how-it-works') 
                  ? 'text-white underline underline-offset-4 decoration-white' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {t('howItWorks')}
            </Link>
            <Link
              href="/booking"
              className="cta px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
            >
              {t('bookMeeting')}
            </Link>
            <LanguageSwitcher />
          </nav>
          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          onClick={closeMenu}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <nav 
            className="absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              <Link
                href="/"
                onClick={closeMenu}
                className={`text-lg font-medium transition-colors py-2 ${
                  isActive('/') 
                    ? 'text-white underline underline-offset-4 decoration-white' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {t('home')}
              </Link>
              <Link
                href="/how-it-works"
                onClick={closeMenu}
                className={`text-lg font-medium transition-colors py-2 ${
                  isActive('/how-it-works') 
                    ? 'text-white underline underline-offset-4 decoration-white' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {t('howItWorks')}
              </Link>
              <Link
                href="/booking"
                onClick={closeMenu}
                className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors text-center"
              >
                {t('bookMeeting')}
              </Link>
              <div className="pt-4 border-t border-white/10">
                <LanguageSwitcher />
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

