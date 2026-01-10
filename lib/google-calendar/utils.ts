// Utility functions for Google Calendar integration

import { format, startOfDay, endOfDay } from 'date-fns'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'
import { TIMEZONE, TIME_SLOTS } from '../constants'
import { getBusyTimes, isTimeSlotBusy } from './client'

// Get available slots for a specific date
export async function getAvailableSlotsForDate(date: Date) {
  // Convert date to Stockholm timezone for the day boundaries
  const zonedDate = toZonedTime(date, TIMEZONE)
  const dayStart = startOfDay(zonedDate)
  const dayEnd = endOfDay(zonedDate)

  // Convert to UTC for Google Calendar API
  const dayStartUTC = fromZonedTime(dayStart, TIMEZONE)
  const dayEndUTC = fromZonedTime(dayEnd, TIMEZONE)

  // Get busy times from Google Calendar
  let busyPeriods: Array<{ start: string; end: string }> = []
  try {
    const busy = await getBusyTimes(dayStartUTC, dayEndUTC)
    // Filter out any periods with null/undefined start or end, and ensure they're strings
    busyPeriods = busy
      .filter((period) => period.start && period.end)
      .map((period) => ({
        start: period.start!,
        end: period.end!,
      }))
  } catch (error) {
    console.error('Error fetching busy times, assuming all slots available:', error)
    // Continue with empty busy periods if API fails
  }

  // Check each time slot against busy periods
  const availableSlots = TIME_SLOTS.map((timeSlot) => {
    const isBusy = isTimeSlotBusy(timeSlot, busyPeriods)
    return {
      timeSlot,
      available: !isBusy,
    }
  })

  return availableSlots
}

// Format date as YYYY-MM-DD for database storage
export function formatDateForStorage(date: Date): string {
  return format(toZonedTime(date, TIMEZONE), 'yyyy-MM-dd')
}

// Parse date string (YYYY-MM-DD) to Date object in Stockholm timezone
export function parseDateFromStorage(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return fromZonedTime(date, TIMEZONE)
}

