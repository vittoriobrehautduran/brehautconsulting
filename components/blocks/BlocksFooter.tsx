'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { CONTACT_EMAIL, CONTACT_PHONE, LINKEDIN_URL } from '@/lib/constants'
import { HOME, sitePath } from '@/components/blocks/serviceRoutes'
import { OPEN_CONSENT_EVENT } from '@/components/consent/CookieConsent'

// Site footer for the live redesign — stacks cleanly on phone.
export default function BlocksFooter() {
  const tFooter = useTranslations('common.footer')

  return (
    <footer className="blocks-site__footer" id="site-footer">
      <div className="blocks-site__wrap">
        <div className="blocks-site__footer-top">
          <Link className="blocks-scroll__logo" href={HOME}>
            <Image
              src="/media/brand/logo-white-128.png"
              alt=""
              width={28}
              height={28}
              aria-hidden
            />
            <span>Brehaut Consulting</span>
          </Link>
          <p className="blocks-site__footer-lede">
            {tFooter('servingClients')}. {tFooter('regions')}.
          </p>
        </div>

        <div className="blocks-site__footer-grid">
          <div className="blocks-site__footer-contact">
            <h3>
              <Link className="blocks-site__footer-heading-link" href={sitePath('contact')}>
                {tFooter('contactUs')}
                <span aria-hidden="true">↗</span>
              </Link>
            </h3>
            <ul>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>
                  <span className="blocks-site__footer-label">{tFooter('email')}</span>
                  <span className="blocks-site__footer-value">{CONTACT_EMAIL}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}>
                  <span className="blocks-site__footer-label">{tFooter('phone')}</span>
                  <span className="blocks-site__footer-value">{CONTACT_PHONE}</span>
                </a>
              </li>
              <li>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                  <span className="blocks-site__footer-label">LinkedIn</span>
                  <span className="blocks-site__footer-value">
                    Brehaut Consulting <span aria-hidden="true">↗</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="blocks-site__legal">
          <p>
            &copy; {new Date().getFullYear()} Brehaut Consulting.{' '}
            {tFooter('copyright')}
          </p>
          <nav className="blocks-site__legal-links" aria-label={tFooter('legal')}>
            <Link href={sitePath('privacy')}>{tFooter('privacy')}</Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
            >
              {tFooter('cookieSettings')}
            </button>
          </nav>
        </div>
      </div>
    </footer>
  )
}
