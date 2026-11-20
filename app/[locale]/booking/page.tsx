import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ locale: string }>
}

// Booking calendar retired — send everyone to the contact form.
export default async function BookingRedirectPage({ params }: Props) {
  const { locale } = await params
  redirect(`/${locale}/contact`)
}
