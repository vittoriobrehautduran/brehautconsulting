'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/constants'

const HERO_VIDEO_SRC = '/media/about/loop.webm'

const SERVICE_KEYS = [
  'service1',
  'service2',
  'service3',
  'service4',
  'service5',
  'service6',
] as const

// Full homepage redesign preview (separate from the live site).
// Palette: black / white / ~10% light blue. Existing logo + copy tone.
export default function HomeHeroRedesign() {
  const t = useTranslations('home')
  const tServices = useTranslations('home.services')
  const tAbout = useTranslations('home.about')
  const tFaq = useTranslations('home.faq')
  const tCta = useTranslations('home.cta')
  const tCommon = useTranslations('common.buttons')
  const tNav = useTranslations('common.nav')
  const tFooter = useTranslations('common.footer')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const heroVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const root = document.documentElement
    const previous = {
      type: root.getAttribute('data-type'),
      radius: root.getAttribute('data-radius'),
      buttons: root.getAttribute('data-buttons'),
    }

    root.setAttribute('data-type', 'service')
    root.setAttribute('data-radius', 'soft')
    root.setAttribute('data-buttons', 'arrow')
    root.classList.add('m-enter')
    const doneTimer = window.setTimeout(() => {
      root.classList.add('m-enter-done')
    }, 700)

    return () => {
      window.clearTimeout(doneTimer)
      root.classList.remove('m-enter', 'm-enter-done')
      if (previous.type) root.setAttribute('data-type', previous.type)
      else root.removeAttribute('data-type')
      if (previous.radius) root.setAttribute('data-radius', previous.radius)
      else root.removeAttribute('data-radius')
      if (previous.buttons) root.setAttribute('data-buttons', previous.buttons)
      else root.removeAttribute('data-buttons')
    }
  }, [])

  // Start the hero video as soon as the page is ready (muted so browsers allow autoplay).
  useEffect(() => {
    const video = heroVideoRef.current
    if (!video) return

    video.muted = true
    const playPromise = video.play()
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Autoplay can still fail on some browsers; click-to-replay remains available.
      })
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const faqItems = Array.from({ length: 6 }, (_, index) => ({
    question: tFaq(`items.${index}.question`),
    answer: tFaq(`items.${index}.answer`),
  }))

  const closeMenu = () => setMenuOpen(false)

  // Replay from the start when the user clicks the hero (not a CTA/link).
  const replayHeroVideo = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement
    if (target.closest('a, button')) return
    const video = heroVideoRef.current
    if (!video) return
    video.currentTime = 0
    void video.play()
  }

  return (
    <div className="taste-redesign">
      <a className="skip-link" href="#top">
        Skip to content
      </a>

      <header className={`nav nav--brand${menuOpen ? ' is-open' : ''}`}>
        <div className="wrap nav__bar">
          <Link className="nav__logo" href="/#top" onClick={closeMenu}>
            <Image
              src="/images/bclogorefined.png"
              alt="Brehaut Consulting"
              width={36}
              height={36}
              priority
            />
            <span>Brehaut Consulting</span>
          </Link>

          <nav className="nav__links" aria-label="Main">
            <div className="nav__item">
              <a className="nav__link" href="#services" onClick={closeMenu}>
                Services
              </a>
            </div>
            <div className="nav__item">
              <a className="nav__link" href="#about" onClick={closeMenu}>
                About
              </a>
            </div>
            <div className="nav__item">
              <a className="nav__link" href="#faq" onClick={closeMenu}>
                FAQ
              </a>
            </div>
          </nav>

          <div className="nav__actions">
            <Link className="btn btn--primary" href="/booking" onClick={closeMenu}>
              {tCommon('bookMeeting')}
              <svg className="m-arrow" viewBox="0 0 12 12" aria-hidden="true">
                <path className="m-arrow__stem" d="M1 6h8" />
                <path className="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5" />
              </svg>
            </Link>
          </div>

          <button
            className="nav__toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              {menuOpen ? (
                <path
                  d="M4 4l10 10M14 4L4 14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M2 5h14M2 13h14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      <main id="top">
        <section
          className="hero hero--video"
          data-enter
          aria-labelledby="hero-h"
          onClick={replayHeroVideo}
        >
          {/* Full-bleed background on every breakpoint — text sits above with a scrim. */}
          <video
            ref={heroVideoRef}
            className="hero__bg hero__video"
            src={HERO_VIDEO_SRC}
            autoPlay
            muted
            playsInline
            preload="auto"
            // No loop: click the hero to restart from the beginning.
            aria-label="Hero animation: phone filling with enquiries. Click to play again."
          />
          <div className="wrap">
            <div className="hero-video-copy">
              <p className="hero__brand">
                <Image
                  src="/images/bclogorefined.png"
                  alt=""
                  width={28}
                  height={28}
                  aria-hidden
                />
                Brehaut Consulting
              </p>
              <h1 id="hero-h">
                Digital systems for{" "}
                <span className="hero__h1-rest">customer growth</span>
              </h1>
              <p className="hero__lead">{t('hero.description')}</p>
              <div className="btn-row">
                <Link className="btn btn--primary" href="/booking">
                  {tCommon('bookMeeting')}
                  <svg className="m-arrow" viewBox="0 0 12 12" aria-hidden="true">
                    <path className="m-arrow__stem" d="M1 6h8" />
                    <path className="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5" />
                  </svg>
                </Link>
                <a className="btn btn--secondary" href="#services">
                  {tCommon('viewServices')}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="services" aria-labelledby="services-h">
          <div className="wrap">
            <div className="section-head">
              <h2 id="services-h">{tServices('title')}</h2>
              <p>{t('hero.tagline')}</p>
            </div>
            <ul className="service-rows">
              {SERVICE_KEYS.map((key) => (
                <li key={key}>
                  <h3 className="service-rows__title">
                    {tServices(`${key}.title`)}
                    <span className="service-rows__sub">
                      {tServices(`${key}.subtitle`)}
                    </span>
                  </h3>
                  <p className="service-rows__body">
                    {tServices(`${key}.description`)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="action-strip">
              <p>{tCta('description')}</p>
              <Link className="btn btn--primary" href="/booking">
                {tCommon('bookMeeting')}
                <svg className="m-arrow" viewBox="0 0 12 12" aria-hidden="true">
                  <path className="m-arrow__stem" d="M1 6h8" />
                  <path className="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section
          className="section section--surface"
          id="about"
          aria-labelledby="about-h"
        >
          {/* Inner grid (not on .wrap) so taste flex .wrap rules cannot stack/overlap the columns */}
          <div className="wrap">
            <div className="about-grid">
              <div className="about-copy">
                <div className="section-head">
                  <h2 id="about-h">{tAbout('title')}</h2>
                </div>
                <p>{tAbout('description1')}</p>
                <p>{tAbout('description2')}</p>
              </div>
              <figure className="about-photo">
                <img
                  src="/taste/img/photo-f76082660.jpg"
                  srcSet="/taste/img/photo-f76082660-500.jpg 500w, /taste/img/photo-f76082660-960.jpg 960w, /taste/img/photo-f76082660.jpg 1280w"
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  width={1280}
                  height={853}
                  alt="Pale concrete surface with quiet architectural light"
                  loading="lazy"
                  decoding="async"
                  data-source="stand-in"
                  data-subject="stand-in"
                />
              </figure>
            </div>
          </div>
        </section>

        <section
          className="section section--inverse"
          id="faq"
          aria-labelledby="faq-h"
        >
          <div className="wrap">
            <div className="section-head">
              <h2 id="faq-h">{tFaq('title')}</h2>
            </div>
            <ul className="faq-list">
              {faqItems.map((faq, index) => {
                const isOpen = openFaq === index
                const triggerId = `redesign-faq-trigger-${index}`
                const panelId = `redesign-faq-panel-${index}`

                return (
                  <li
                    key={faq.question}
                    className={`faq-item${isOpen ? ' is-open' : ''}`}
                  >
                    <button
                      id={triggerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                    >
                      <h3>{faq.question}</h3>
                      {/* width/height attrs: taste sets svg{max-width:100%} which can blow icons up to the row width */}
                      <svg
                        className="faq-icon"
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </svg>
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      className="faq-panel"
                    >
                      <div>
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </main>

      <footer className="closing" id="contact" aria-labelledby="close-h">
        <div className="wrap">
          <div className="closing__cta close--type">
            <div>
              <h2 id="close-h">{tCta('title')}</h2>
              <p>{tCta('description')}</p>
            </div>
            <Link className="btn btn--primary btn--xl" href="/booking">
              {tCommon('getStarted')}
              <svg className="m-arrow" viewBox="0 0 12 12" aria-hidden="true">
                <path className="m-arrow__stem" d="M1 6h8" />
                <path className="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5" />
              </svg>
            </Link>
          </div>

          <div className="closing__links">
            <div className="footer-grid">
              <div>
                <Link className="footer-brand" href="/#top">
                  <Image
                    src="/images/bclogorefined.png"
                    alt=""
                    width={28}
                    height={28}
                    aria-hidden
                  />
                  Brehaut Consulting
                </Link>
                <p className="footer-lede">
                  {tFooter('servingClients')}. {tFooter('regions')}.
                </p>
              </div>
              <div className="footer-col">
                <h4>{tFooter('contactUs')}</h4>
                <ul>
                  <li>
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  </li>
                  <li>
                    <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}>
                      {CONTACT_PHONE}
                    </a>
                  </li>
                  <li>
                    <Link href="/booking">{tCommon('bookMeeting')}</Link>
                  </li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>{tNav('howItWorks')}</h4>
                <ul>
                  <li>
                    <a href="#services">{tServices('title')}</a>
                  </li>
                  <li>
                    <Link href="/how-it-works">{tNav('howItWorks')}</Link>
                  </li>
                  <li>
                    <a href="#faq">{tFaq('title')}</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="footer-legal">
              <span>
                &copy; {new Date().getFullYear()} Brehaut Consulting.{' '}
                {tFooter('copyright')}
              </span>
              <details>
                <summary>Photographs via Wikimedia Commons</summary>
                <p>
                  Black and white concrete interior by Verne Ho (CC0); white
                  concrete by Tyto Albatraoz (CC BY 3.0), via Wikimedia Commons.
                  Stand-ins for client photography.
                </p>
              </details>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
