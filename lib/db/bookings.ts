// Database queries for bookings

import { prisma } from './client'
import { TimeSlot, MAX_BOOKINGS_PER_SLOT } from '@/lib/constants'
import { parseDateFromStorage, formatDateForStorage } from '@/lib/google-calendar/utils'

// Check if a slot is available (not at capacity and date is valid)
export async function isSlotAvailable(date: Date, timeSlot: TimeSlot): Promise<boolean> {
  const dateStr = formatDateForStorage(date)

  const bookingCount = await prisma.booking.count({
    where: {
      date: parseDateFromStorage(dateStr),
      timeSlot,
      status: 'confirmed',
    },
  })

  return bookingCount < MAX_BOOKINGS_PER_SLOT
}

// Get booking count for a specific date and time slot
export async function getBookingCount(date: Date, timeSlot: TimeSlot): Promise<number> {
  const dateStr = formatDateForStorage(date)

  return await prisma.booking.count({
    where: {
      date: parseDateFromStorage(dateStr),
      timeSlot,
      status: 'confirmed',
    },
  })
}

// Create a new booking
export async function createBooking(
  name: string,
  email: string,
  date: Date,
  timeSlot: TimeSlot,
  company?: string,
  message?: string
) {
  const dateStr = formatDateForStorage(date)

  return await prisma.booking.create({
    data: {
      name,
      email,
      company,
      message,
      date: parseDateFromStorage(dateStr),
      timeSlot,
      status: 'confirmed',
    },
  })
}

// Get all bookings for a specific date (for checking availability)
export async function getBookingsForDate(date: Date) {
  const dateStr = formatDateForStorage(date)

  return await prisma.booking.findMany({
    where: {
      date: parseDateFromStorage(dateStr),
      status: 'confirmed',
    },
  })
}

