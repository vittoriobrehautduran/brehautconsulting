'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Loader2 } from 'lucide-react'
import BlocksNav from '@/components/blocks/BlocksNav'
import BlocksFooter from '@/components/blocks/BlocksFooter'
import { CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/constants'
import { trackLeadStarted, trackLeadSubmitted } from '@/lib/analytics/gtm'

const SERVICE_KEYS = [
  'service1',
  'service3',
  'service4',
  'service5',
  'service6',
] as const

const INTEREST_WHOLE = 'whole'
const INTEREST_OTHER = 'other'

// Contact form — emails the team via the create-contact Netlify function.
export default function BlocksContact() {
  const t = useTranslations('contact')
  const tServices = useTranslations('home.services')
  const tCommon = useTranslations('common.buttons')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [website, setWebsite] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  // Anti-spam: honeypot value and when the form was first shown.
  const [fax, setFax] = useState('')
  const startedAt = useRef<number>(0)

  useEffect(() => {
    startedAt.current = Date.now()
    trackLeadStarted()
  }, [])

  const toggleInterest = (key: string) => {
    setInterests((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    )
    setErrors((prev) => ({ ...prev, interests: '' }))
  }

  const interestLabel = (key: string) => {
    if (key === INTEREST_WHOLE) return t('form.wholeSystem')
    if (key === INTEREST_OTHER) return t('form.other')
    return tServices(`${key}.title`)
  }

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const nextErrors: Record<string, string> = {}
    if (!name.trim()) nextErrors.name = t('form.errors.nameRequired')
    if (!email.trim()) nextErrors.email = t('form.errors.emailRequired')
    else if (!validateEmail(email.trim())) {
      nextErrors.email = t('form.errors.emailInvalid')
    }
    if (!phone.trim()) nextErrors.phone = t('form.errors.phoneRequired')
    if (!company.trim()) nextErrors.company = t('form.errors.companyRequired')
    if (interests.length === 0) {
      nextErrors.interests = t('form.errors.interestRequired')
    }
    if (interests.includes(INTEREST_OTHER) && !message.trim()) {
      nextErrors.message = t('form.errors.messageRequired')
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const response = await fetch('/.netlify/functions/create-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          company: company.trim(),
          website: website.trim() || undefined,
          interests: interests.map(interestLabel),
          message: message.trim() || undefined,
          fax: fax || undefined,
          startedAt: startedAt.current,
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (response.status === 429) {
        throw new Error(t('form.errors.rateLimited'))
      }
      if (!response.ok || !result.success) {
        throw new Error(t('form.errors.submitFailed'))
      }

      trackLeadSubmitted()
      setSuccessMessage(t('success'))
      setName('')
      setEmail('')
      setPhone('')
      setCompany('')
      setWebsite('')
      setInterests([])
      setMessage('')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t('form.errors.submitFailed')
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="blocks-site blocks-site--page">
      <BlocksNav />

      <main className="blocks-site__page">
        <div className="blocks-site__wrap">
          <header className="blocks-site__page-intro">
            <h1>{t('title')}</h1>
            <p>{t('subtitle')}</p>
          </header>

          <div className="blocks-site__booking-layout">
            <div className="blocks-site__booking-main">
              {successMessage ? (
                <p className="blocks-site__banner blocks-site__banner--ok" role="status">
                  {successMessage}
                </p>
              ) : null}
              {errorMessage ? (
                <p className="blocks-site__banner blocks-site__banner--err" role="alert">
                  {errorMessage}
                </p>
              ) : null}

              <form
                className="blocks-site__contact-form blocks-site__contact-box"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="blocks-site__contact-grid">
                  <label className="blocks-site__field">
                    <span>
                      {t('form.name')}
                      <abbr title="required">{t('form.required')}</abbr>
                    </span>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value)
                        setErrors((prev) => ({ ...prev, name: '' }))
                      }}
                      disabled={isSubmitting}
                    />
                    {errors.name ? <em>{errors.name}</em> : null}
                  </label>

                  <label className="blocks-site__field">
                    <span>
                      {t('form.email')}
                      <abbr title="required">{t('form.required')}</abbr>
                    </span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value)
                        setErrors((prev) => ({ ...prev, email: '' }))
                      }}
                      disabled={isSubmitting}
                    />
                    {errors.email ? <em>{errors.email}</em> : null}
                  </label>

                  <label className="blocks-site__field">
                    <span>
                      {t('form.phone')}
                      <abbr title="required">{t('form.required')}</abbr>
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) => {
                        setPhone(event.target.value)
                        setErrors((prev) => ({ ...prev, phone: '' }))
                      }}
                      disabled={isSubmitting}
                    />
                    {errors.phone ? <em>{errors.phone}</em> : null}
                  </label>

                  <label className="blocks-site__field">
                    <span>
                      {t('form.company')}
                      <abbr title="required">{t('form.required')}</abbr>
                    </span>
                    <input
                      type="text"
                      name="company"
                      autoComplete="organization"
                      value={company}
                      onChange={(event) => {
                        setCompany(event.target.value)
                        setErrors((prev) => ({ ...prev, company: '' }))
                      }}
                      disabled={isSubmitting}
                    />
                    {errors.company ? <em>{errors.company}</em> : null}
                  </label>

                  <label className="blocks-site__field blocks-site__field--wide">
                    <span>{t('form.website')}</span>
                    <input
                      type="url"
                      name="website"
                      autoComplete="url"
                      placeholder="https://"
                      value={website}
                      onChange={(event) => setWebsite(event.target.value)}
                      disabled={isSubmitting}
                    />
                  </label>
                </div>

                <fieldset className="blocks-site__interest">
                  <legend>
                    {t('form.interest')}
                    <abbr title="required">{t('form.required')}</abbr>
                  </legend>
                  <div className="blocks-site__interest-list">
                    <label className="blocks-site__check">
                      <input
                        type="checkbox"
                        checked={interests.includes(INTEREST_WHOLE)}
                        onChange={() => toggleInterest(INTEREST_WHOLE)}
                        disabled={isSubmitting}
                      />
                      <span>{t('form.wholeSystem')}</span>
                    </label>
                    {SERVICE_KEYS.map((key) => (
                      <label key={key} className="blocks-site__check">
                        <input
                          type="checkbox"
                          checked={interests.includes(key)}
                          onChange={() => toggleInterest(key)}
                          disabled={isSubmitting}
                        />
                        <span>{tServices(`${key}.title`)}</span>
                      </label>
                    ))}
                    <label className="blocks-site__check">
                      <input
                        type="checkbox"
                        checked={interests.includes(INTEREST_OTHER)}
                        onChange={() => toggleInterest(INTEREST_OTHER)}
                        disabled={isSubmitting}
                      />
                      <span>{t('form.other')}</span>
                    </label>
                  </div>
                  {errors.interests ? <em>{errors.interests}</em> : null}
                </fieldset>

                <label className="blocks-site__field">
                  <span>
                    {t('form.message')}
                    {interests.includes(INTEREST_OTHER) ? (
                      <abbr title="required">{t('form.required')}</abbr>
                    ) : null}
                  </span>
                  <textarea
                    name="message"
                    rows={3}
                    value={message}
                    onChange={(event) => {
                      setMessage(event.target.value)
                      setErrors((prev) => ({ ...prev, message: '' }))
                    }}
                    disabled={isSubmitting}
                    placeholder={t('form.messageHint')}
                  />
                  {errors.message ? <em>{errors.message}</em> : null}
                </label>

                {/* Honeypot: invisible to people, bots tend to fill it. */}
                <div className="blocks-site__hp" aria-hidden="true">
                  <label>
                    Fax
                    <input
                      type="text"
                      name="fax"
                      tabIndex={-1}
                      autoComplete="off"
                      value={fax}
                      onChange={(event) => setFax(event.target.value)}
                    />
                  </label>
                </div>

                <p className="blocks-site__consent-note">
                  {t.rich('form.privacyNotice', {
                    link: (chunks) => <Link href="/privacy">{chunks}</Link>,
                  })}
                </p>

                <button
                  type="submit"
                  className="blocks-scroll__cta blocks-scroll__cta--solid"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      {tCommon('sending')}
                    </>
                  ) : (
                    tCommon('sendMessage')
                  )}
                </button>
              </form>
            </div>

            <aside className="blocks-site__booking-aside">
              <div>
                <h2>{t('aside.title')}</h2>
                <p>{t('aside.description')}</p>
              </div>
              <div>
                <h2>{CONTACT_EMAIL}</h2>
                <p>
                  <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}>
                    {CONTACT_PHONE}
                  </a>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <BlocksFooter />
    </div>
  )
}
