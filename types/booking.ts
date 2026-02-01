// TypeScript types for booking system

import { TimeSlot } from '@/lib/constants'

export interface BookingRequest {
  name: string
  email: string
  company?: string
  message?: string
  date: string // ISO date string (YYYY-MM-DD)
  timeSlot: TimeSlot
}

export interface BookingResponse {
  success: boolean
  bookingId?: string
  error?: string
}

export interface AvailableSlot {
  timeSlot: TimeSlot
  available: boolean
}

export interface AvailableSlotsResponse {
  date: string
  availableSlots: AvailableSlot[]
}

