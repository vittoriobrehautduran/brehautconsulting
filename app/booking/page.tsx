// Booking page with calendar, time slot selector, and booking form

'use client'

import { useState, useEffect } from 'react'
import DatePicker from '@/components/ui/DatePicker'
import TimeSlotSelector from '@/components/ui/TimeSlotSelector'
import BookingForm from '@/components/ui/BookingForm'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TimeSlot } from '@/lib/constants'
import { AvailableSlotsResponse, BookingRequest } from '@/types/booking'
import { Loader2 } from 'lucide-react'

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
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
        const dateStr = selectedDate.toISOString().split('T')[0]
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
        const dateStr = selectedDate.toISOString().split('T')[0]
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
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Book a Meeting
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
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
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          isLoading={isLoadingSlots || isSubmitting}
        />
      </div>

      {selectedDate && (
        <div className="mb-8">
          {isLoadingSlots ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <TimeSlotSelector
              availableSlots={availableSlots?.availableSlots || []}
              selectedTimeSlot={selectedTimeSlot}
              onSelect={handleTimeSlotSelect}
              isLoading={isSubmitting}
            />
          )}
        </div>
      )}

      {selectedDate && selectedTimeSlot && (
        <BookingForm
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          onSubmit={handleBookingSubmit}
          isLoading={isSubmitting}
        />
      )}
    </div>
  )
}
