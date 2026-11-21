'use client'

import { useEffect, useState } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import BlocksNotFound from '@/components/blocks/BlocksNotFound'

// Full message files per locale (JSON imports don't fit AbstractIntlMessages
// because of arrays read with t.raw).
type Props = { messages: Record<string, any> }

// 404 content for app/not-found.tsx. That file can't read the locale on the
// server without making every page dynamic, so it renders English and this
// switches to the URL's language (/sv/..., /es/...) right after load.
export default function LocalizedNotFound({ messages }: Props) {
  const [locale, setLocale] = useState('en')

  useEffect(() => {
    const segment = window.location.pathname.split('/')[1]
    if (segment && segment !== 'en' && segment in messages) {
      setLocale(segment)
      document.documentElement.lang = segment
      const notFound = messages[segment].notFound as { title?: string }
      if (notFound?.title) document.title = `${notFound.title} | Brehaut Consulting`
    }
  }, [messages])

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      <BlocksNotFound />
    </NextIntlClientProvider>
  )
}
