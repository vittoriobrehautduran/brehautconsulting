// Netlify serverless function to get available time slots for a date

import { Handler } from '@netlify/functions'
import { prisma } from '../../lib/db/client'
import { TIME_SLOTS, WORK_DAYS, MAX_BOOKINGS_PER_SLOT, TIMEZONE } from '../../lib/constants'
import { getAvailableSlotsForDate, parseDateFromStorage, formatDateForStorage } from '../../lib/google-calendar/utils'
import { getBookingCount } from '../../lib/db/bookings'

export const handler: Handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const dateParam = event.queryStringParameters?.date

    if (!dateParam) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Date parameter is required' }),
      }
    }

    // Parse and validate date
    const date = new Date(dateParam)
    if (isNaN(date.getTime())) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Invalid date format' }),
      }
    }

    // Check if date is a work day (Monday-Thursday)
    const dayOfWeek = date.getDay()
    if (!WORK_DAYS.includes(dayOfWeek)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Date must be a Monday through Thursday' }),
      }
    }

    // Get available slots from Google Calendar
    const calendarSlots = await getAvailableSlotsForDate(date)

    // Check database for booking counts
    const dateStr = formatDateForStorage(date)
    const availableSlots = await Promise.all(
      TIME_SLOTS.map(async (timeSlot) => {
        const bookingCount = await getBookingCount(date, timeSlot)
        const isAtCapacity = bookingCount >= MAX_BOOKINGS_PER_SLOT

        // Find corresponding calendar slot
        const calendarSlot = calendarSlots.find((s) => s.timeSlot === timeSlot)
        const isCalendarBusy = calendarSlot ? !calendarSlot.available : false

        // Slot is available only if not at capacity AND not busy in calendar
        return {
          timeSlot,
          available: !isAtCapacity && !isCalendarBusy,
        }
      })
    )

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        date: dateParam,
        availableSlots,
      }),
    }
  } catch (error) {
    console.error('Error fetching available slots:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}

