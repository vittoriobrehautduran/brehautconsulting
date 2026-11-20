'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/constants'
import { HOME, sitePath } from '@/components/blocks/serviceRoutes'

// Site footer for the live redesign — stacks cleanly on phone.
export default function BlocksFooter() {
  const tFooter = useTranslations('common.footer')
  const tCommon = useTranslations('common.buttons')

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
            <h3>{tFooter('contactUs')}</h3>
            <ul>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
              <li>
                <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}>{CONTACT_PHONE}</a>
              </li>
              <li>
                <Link
                  className="blocks-site__footer-cta"
                  href={sitePath('contact')}
                >
                  {tCommon('contactUs')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="blocks-site__legal">
          &copy; {new Date().getFullYear()} Brehaut Consulting.{' '}
          {tFooter('copyright')}
        </p>
      </div>
    </footer>
  )
}
