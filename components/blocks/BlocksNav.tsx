'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import { Link, usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { HOME, SERVICE_PAGES, sitePath } from '@/components/blocks/serviceRoutes'
import BlocksLanguageSwitcher from '@/components/blocks/BlocksLanguageSwitcher'

// Shared top nav for the live redesign site.
export default function BlocksNav() {
  const tNav = useTranslations('common.nav')
  const tCommon = useTranslations('common.buttons')
  const tServices = useTranslations('home.services')
  const tBlocks = useTranslations('blocks')
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false)
  const servicesId = useId()
  const desktopServicesRef = useRef<HTMLDivElement>(null)

  const isContactPage =
    pathname === '/contact' || pathname.endsWith('/contact')

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Close sticky desktop menu on outside click / Escape.
  useEffect(() => {
    if (!desktopServicesOpen) return

    const onPointerDown = (event: PointerEvent) => {
      if (desktopServicesRef.current?.contains(event.target as Node)) return
      setDesktopServicesOpen(false)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDesktopServicesOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [desktopServicesOpen])

  const closeAll = () => {
    setMenuOpen(false)
    setMobileServicesOpen(false)
    setDesktopServicesOpen(false)
  }

  const serviceItems = SERVICE_PAGES.map((service) => ({
    key: service.key,
    href: sitePath('services', service.slug),
    title: tServices(`${service.key}.title`),
  }))

  return (
    <header className={`blocks-scroll__nav${menuOpen ? ' is-open' : ''}`}>
      <div className="blocks-scroll__nav-inner">
        <Link className="blocks-scroll__logo" href={HOME} onClick={closeAll}>
          <Image
            src="/media/brand/logo-white.svg"
            alt="Brehaut Consulting"
            width={32}
            height={32}
            priority
          />
          <span>Brehaut Consulting</span>
        </Link>

        <nav className="blocks-scroll__links" aria-label="Main">
          <Link href={HOME} onClick={closeAll}>
            {tNav('home')}
          </Link>
          <Link href={sitePath('how-it-works')} onClick={closeAll}>
            {tNav('howItWorks')}
          </Link>

          {/* CSS :hover opens the menu; click toggles sticky open for keyboard. */}
          <div
            ref={desktopServicesRef}
            className={`blocks-scroll__services${desktopServicesOpen ? ' is-open' : ''}`}
          >
            <button
              type="button"
              className="blocks-scroll__services-trigger"
              aria-expanded={desktopServicesOpen}
              aria-controls={servicesId}
              aria-haspopup="menu"
              onClick={() => setDesktopServicesOpen((open) => !open)}
            >
              {tNav('services')}
              <span className="blocks-scroll__services-caret" aria-hidden="true">
                ▾
              </span>
            </button>
            <ul
              id={servicesId}
              className="blocks-scroll__services-menu"
              role="list"
            >
              {serviceItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      window.setTimeout(closeAll, 0)
                    }}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="blocks-scroll__nav-end">
          <BlocksLanguageSwitcher onNavigate={closeAll} />

          {!isContactPage ? (
            <Link
              className="blocks-scroll__cta"
              href={sitePath('contact')}
              onClick={closeAll}
            >
              {tCommon('contactUs')}
            </Link>
          ) : null}

          <button
            className="blocks-scroll__toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? tBlocks('closeMenu') : tBlocks('openMenu')}
            onClick={() => {
              setMenuOpen((open) => !open)
              setMobileServicesOpen(false)
            }}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="blocks-scroll__sheet">
          <Link href={HOME} onClick={closeAll}>
            {tNav('home')}
          </Link>
          <Link href={sitePath('how-it-works')} onClick={closeAll}>
            {tNav('howItWorks')}
          </Link>

          <div
            className={`blocks-scroll__sheet-services${mobileServicesOpen ? ' is-open' : ''}`}
          >
            <button
              type="button"
              className="blocks-scroll__sheet-services-trigger"
              aria-expanded={mobileServicesOpen}
              aria-controls={`${servicesId}-mobile`}
              onClick={() => setMobileServicesOpen((open) => !open)}
            >
              {tNav('services')}
              <span aria-hidden="true">{mobileServicesOpen ? '−' : '+'}</span>
            </button>
            {mobileServicesOpen ? (
              <ul
                id={`${servicesId}-mobile`}
                className="blocks-scroll__sheet-services-menu"
              >
                {serviceItems.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        window.setTimeout(closeAll, 0)
                      }}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {!isContactPage ? (
            <Link href={sitePath('contact')} onClick={closeAll}>
              {tCommon('contactUs')}
            </Link>
          ) : null}
        </div>
      ) : null}
    </header>
  )
}
