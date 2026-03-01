// Netlify serverless function to get available time slots for a date

import { Handler } from '@netlify/functions'
import { prisma } from '../../lib/db/client'
import { TIME_SLOTS, WORK_DAYS, MAX_BOOKINGS_PER_SLOT, TIMEZONE } from '../../lib/constants'
import { getAvailableSlotsForDate, parseDateFromStorage, formatDateForStorage } from '../../lib/google-calendar/utils'
import { getBookingCount } from '../../lib/db/bookings'
import { toZonedTime } from 'date-fns-tz'

export const handler: Handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
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

    // Parse date using the same method as bookings (YYYY-MM-DD format)
    // This ensures we're querying the database with the same date format
    const parsedDate = parseDateFromStorage(dateParam)
    if (isNaN(parsedDate.getTime())) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Invalid date format' }),
      }
    }

    // Check if date is a work day (Monday-Thursday) in Stockholm timezone
    const dateInStockholm = toZonedTime(parsedDate, TIMEZONE)
    const dayOfWeek = dateInStockholm.getDay()
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
    const calendarSlots = await getAvailableSlotsForDate(parsedDate)

    // Check database for booking counts
    // Use the parsed date to ensure we're querying with the same format as stored in DB
    const availableSlots = await Promise.all(
      TIME_SLOTS.map(async (timeSlot) => {
        let bookingCount = 0
        try {
          bookingCount = await getBookingCount(parsedDate, timeSlot)
          console.log(`Slot ${timeSlot} on ${dateParam}: ${bookingCount} bookings (max: ${MAX_BOOKINGS_PER_SLOT})`)
        } catch (dbError) {
          console.error('Database error, assuming no bookings:', dbError)
          // If database fails, assume no bookings (safer to allow booking than block)
          bookingCount = 0
        }
        
        const isAtCapacity = bookingCount >= MAX_BOOKINGS_PER_SLOT

        // Find corresponding calendar slot
        const calendarSlot = calendarSlots.find((s) => s.timeSlot === timeSlot)
        const isCalendarBusy = calendarSlot ? !calendarSlot.available : false

        // Slot is available only if not at capacity AND not busy in calendar
        const isAvailable = !isAtCapacity && !isCalendarBusy
        console.log(`Slot ${timeSlot}: available=${isAvailable} (capacity=${!isAtCapacity}, calendar=${!isCalendarBusy})`)
        
        return {
          timeSlot,
          available: isAvailable,
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // Log full error details for debugging
    console.error('Full error details:', {
      message: errorMessage,
      stack: errorStack,
      error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    })
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: errorMessage,
      }),
    }
  }
}

