import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ locale: string }>
}

// Preview URL retired — redesign is live at the site root.
export default async function BlocksHomeRedirect({ params }: Props) {
  const { locale } = await params
  redirect(`/${locale}`)
}
