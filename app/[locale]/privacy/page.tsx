import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import BlocksNav from '@/components/blocks/BlocksNav'
import BlocksFooter from '@/components/blocks/BlocksFooter'
import BlocksStyles from '@/components/blocks/BlocksStyles'
import { buildPageMetadata } from '@/lib/seo/pageMetadata'

type Props = {
  params: Promise<{ locale: string }>
}

type Section = { heading: string; paragraphs: string[] }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata(locale, 'privacy', '/privacy')
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'privacy' })
  const sections = t.raw('sections') as Section[]

  return (
    <>
      <BlocksStyles />
      <div className="blocks-site blocks-site--page">
        <BlocksNav />
        <main className="blocks-site__page">
          <div className="blocks-site__wrap">
            <header className="blocks-site__page-intro">
              <h1>{t('title')}</h1>
              <p>{t('intro')}</p>
              <p className="blocks-site__prose-meta">{t('updated')}</p>
            </header>

            <div className="blocks-site__prose">
              {sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </main>
        <BlocksFooter />
      </div>
    </>
  )
}
