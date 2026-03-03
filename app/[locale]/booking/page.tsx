// Booking page with calendar, time slot selector, and booking form

'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import ScheduleSelector from '@/components/ui/ScheduleSelector'
import BookingForm from '@/components/ui/BookingForm'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TimeSlot, WORK_DAYS, CONTACT_PHONE } from '@/lib/constants'
import { AvailableSlotsResponse, BookingRequest } from '@/types/booking'
import { Loader2 } from 'lucide-react'
import { startOfDay, addDays } from 'date-fns'
import JsonLd from '@/components/schema/JsonLd'
import {
  generateEventSchema,
  generateBreadcrumbListSchema,
} from '@/lib/schema/jsonld'
import { trackLeadSubmitted } from '@/lib/analytics/gtm'

// Format date as YYYY-MM-DD in local time (not UTC)
function formatDateLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Get today's date, or the next work day if today is not a work day
function getInitialDate(): Date {
  const today = startOfDay(new Date())
  const dayOfWeek = today.getDay()
  
  if (WORK_DAYS.includes(dayOfWeek)) {
    return today
  }
  
  let nextDate = addDays(today, 1)
  while (!WORK_DAYS.includes(nextDate.getDay())) {
    nextDate = addDays(nextDate, 1)
  }
  return nextDate
}

export default function BookingPage() {
  const locale = useLocale()
  const t = useTranslations('booking')
  const tNav = useTranslations('common.nav')
  const [selectedDate, setSelectedDate] = useState<Date | null>(getInitialDate())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [availableSlots, setAvailableSlots] = useState<AvailableSlotsResponse | null>(null)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showPhoneIcon, setShowPhoneIcon] = useState(true)

  // Alternating phone icon/text display
  useEffect(() => {
    const interval = setInterval(() => {
      setShowPhoneIcon((prev) => !prev)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Fetch available slots when date changes
  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots(null)
      setSelectedTimeSlot(null)
      return
    }

    const fetchAvailableSlots = async () => {
      setIsLoadingSlots(true)
      setErrorMessage(null)
      setSelectedTimeSlot(null)

      try {
        const dateStr = formatDateLocal(selectedDate)
        const response = await fetch(`/.netlify/functions/get-available-slots?date=${dateStr}`)

        if (!response.ok) {
        throw new Error(t('form.errors.submitFailed'))
        }

        const data: AvailableSlotsResponse = await response.json()
        setAvailableSlots(data)
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : t('form.errors.submitFailed'))
        setAvailableSlots(null)
      } finally {
        setIsLoadingSlots(false)
      }
    }

    fetchAvailableSlots()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate])

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
    setSelectedTimeSlot(null)
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot)
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  const handleBookingSubmit = async (data: BookingRequest) => {
    setIsSubmitting(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const response = await fetch('/.netlify/functions/create-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        console.error('Booking failed:', result)
        throw new Error(result.error || 'Failed to create booking')
      }

      // Track successful booking submission
      trackLeadSubmitted()

      setSuccessMessage(t('success'))
      setSelectedTimeSlot(null)

      // Refresh available slots
      if (selectedDate) {
        const dateStr = formatDateLocal(selectedDate)
        const slotsResponse = await fetch(`/.netlify/functions/get-available-slots?date=${dateStr}`)
        if (slotsResponse.ok) {
          const slotsData: AvailableSlotsResponse = await slotsResponse.json()
          setAvailableSlots(slotsData)
        }
      }
    } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : t('form.errors.submitFailed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-2xl pt-24 pb-10 md:pb-16 px-4">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-white via-blue-300 to-blue-500 bg-clip-text text-transparent">
          {t('title')}
        </h1>
        <p className="text-blue-100/80 max-w-lg mx-auto text-lg">
          {t('subtitle')}
        </p>
      </div>

      {successMessage && (
        <Alert variant="success" className="mb-6">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="mb-8">
        {isLoadingSlots ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ScheduleSelector
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            availableSlots={availableSlots?.availableSlots || []}
            onDateChange={handleDateChange}
            onTimeSlotSelect={handleTimeSlotSelect}
            isLoading={isSubmitting}
          />
        )}
      </div>

      {/* Call Alternative */}
      <div className="mb-8 text-center">
        <p className="text-blue-100/80 mb-4 text-lg">
          {t('callAlternative')}
        </p>
        <a
          href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white transition-colors text-sm font-medium border border-white/20 rounded-full hover:border-white/40"
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            <svg
              className={`w-5 h-5 absolute transition-all duration-500 ease-in-out ${
                showPhoneIcon
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-90'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span
              className={`transition-all duration-500 ease-in-out ${
                showPhoneIcon
                  ? 'opacity-0 scale-90'
                  : 'opacity-100 scale-100'
              }`}
            >
              {tNav('call')}
            </span>
          </div>
        </a>
      </div>

      {selectedDate && selectedTimeSlot && (
        <BookingForm
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          onSubmit={handleBookingSubmit}
          isLoading={isSubmitting}
        />
      )}

      {/* Information Section */}
      <div className="mt-16 pt-12 border-t border-blue-500/30">
        <div className="space-y-6 text-blue-50/90">
          <div>
            <h3 className="text-xl font-heading font-semibold text-blue-200 mb-3">
              {t('info.purpose.title')}
            </h3>
            <p className="text-lg leading-relaxed">
              {t('info.purpose.description')}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-heading font-semibold text-blue-200 mb-3">
              {t('info.howItWorks.title')}
            </h3>
            <p className="text-lg leading-relaxed">
              {t('info.howItWorks.description')}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-heading font-semibold text-blue-200 mb-3">
              {t('info.rescheduling.title')}
            </h3>
            <p className="text-lg leading-relaxed">
              {t('info.rescheduling.description')}
            </p>
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <JsonLd
        data={[
          // Event Schema for Booking
          generateEventSchema(locale),
          // BreadcrumbList Schema
          generateBreadcrumbListSchema([
            {
              name: locale === 'sv' ? 'Hem' : 'Home',
              url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'}/${locale}`,
            },
            {
              name: t('title'),
              url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://brehautconsulting.com'}/${locale}/booking`,
            },
          ]),
        ]}
      />
    </div>
  )
}
