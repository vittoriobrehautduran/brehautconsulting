// Booking page with calendar, time slot selector, and booking form

'use client'

import { useState, useEffect } from 'react'
import ScheduleSelector from '@/components/ui/ScheduleSelector'
import BookingForm from '@/components/ui/BookingForm'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TimeSlot, WORK_DAYS } from '@/lib/constants'
import { AvailableSlotsResponse, BookingRequest } from '@/types/booking'
import { Loader2 } from 'lucide-react'
import { startOfDay, addDays } from 'date-fns'

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(getInitialDate())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [availableSlots, setAvailableSlots] = useState<AvailableSlotsResponse | null>(null)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
          throw new Error('Failed to fetch available slots')
        }

        const data: AvailableSlotsResponse = await response.json()
        setAvailableSlots(data)
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load available slots')
        setAvailableSlots(null)
      } finally {
        setIsLoadingSlots(false)
      }
    }

    fetchAvailableSlots()
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
        throw new Error(result.error || 'Failed to create booking')
      }

      setSuccessMessage('Booking confirmed! We look forward to meeting with you.')
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
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-2xl pt-24 pb-10 md:pb-16 px-4">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-white via-blue-300 to-blue-500 bg-clip-text text-transparent">
          Book a Meeting
        </h1>
        <p className="text-blue-100/80 max-w-lg mx-auto text-lg">
          Select a date and time that works for you
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
              Meeting Purpose
            </h3>
            <p className="text-lg leading-relaxed">
              This is a short, focused conversation to understand your business, goals, and current challenges — and to see if we're a good fit to work together.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-heading font-semibold text-blue-200 mb-3">
              How the Meeting Works
            </h3>
            <p className="text-lg leading-relaxed">
              The meeting is held online and typically lasts 30 minutes. You'll receive all details by email after booking.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-heading font-semibold text-blue-200 mb-3">
              Rescheduling & Cancellation
            </h3>
            <p className="text-lg leading-relaxed">
              If you need to reschedule or cancel, you can do so up to 24 hours before the meeting. This helps keep availability fair for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
