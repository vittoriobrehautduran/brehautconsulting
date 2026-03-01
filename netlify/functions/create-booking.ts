// Netlify serverless function to create a booking

import { Handler } from '@netlify/functions'
import { prisma } from '../../lib/db/client'
import { WORK_DAYS, TIME_SLOTS, TIMEZONE } from '../../lib/constants'
import { createBooking, isSlotAvailable } from '../../lib/db/bookings'
import { createCalendarEvent } from '../../lib/google-calendar/client'
import { parseDateFromStorage } from '../../lib/google-calendar/utils'
import { sendBookingConfirmationEmail } from '../../lib/email/ses'
import { GOOGLE_CALENDAR_ID } from '../../lib/constants'
import { z } from 'zod'
import { toZonedTime } from 'date-fns-tz'

// Validation schema for booking request
const bookingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  message: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  timeSlot: z.enum(['13-14', '16-17', '18-19'], {
    errorMap: () => ({ message: 'Invalid time slot' }),
  }),
})

export const handler: Handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
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
    // Parse request body
    let body
    try {
      body = JSON.parse(event.body || '{}')
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: 'Invalid request body',
        }),
      }
    }

    // Log received data for debugging
    console.log('Received booking request:', JSON.stringify(body, null, 2))

    // Validate request
    const validationResult = bookingSchema.safeParse(body)
    if (!validationResult.success) {
      const errorDetails = validationResult.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
        code: err.code,
      }))
      console.error('Validation failed:', JSON.stringify(errorDetails, null, 2))
      console.error('Full validation error:', JSON.stringify(validationResult.error, null, 2))
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: validationResult.error.errors[0].message,
          details: errorDetails,
        }),
      }
    }

    console.log('Validation passed')
    const { name, email, company, message, date, timeSlot } = validationResult.data

    // Parse date string to Date object in Stockholm timezone
    const bookingDateUTC = parseDateFromStorage(date)
    console.log('Parsed booking date (UTC):', bookingDateUTC.toISOString())

    // Convert to Stockholm timezone to check the day of week correctly
    // This ensures we check the day in the user's timezone, not UTC
    const bookingDateInStockholm = toZonedTime(bookingDateUTC, TIMEZONE)
    const dayOfWeek = bookingDateInStockholm.getDay()
    console.log('Date in Stockholm timezone:', bookingDateInStockholm.toISOString(), 'Day of week:', dayOfWeek)
    console.log('WORK_DAYS:', WORK_DAYS)

    // Check if date is a work day (Monday-Thursday)
    if (!WORK_DAYS.includes(dayOfWeek)) {
      console.log('Date is not a work day')
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: 'Bookings are only available Monday through Thursday',
        }),
      }
    }
    
    console.log('Date is a work day, checking slot availability')

    // Use the UTC date for all operations (database, calendar, etc.)
    const bookingDate = bookingDateUTC

    // Check if slot is still available
    const slotAvailable = await isSlotAvailable(bookingDate, timeSlot)
    if (!slotAvailable) {
      return {
        statusCode: 409,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: 'This time slot is no longer available',
        }),
      }
    }

    // Create booking in database
    const booking = await createBooking(name, email, bookingDate, timeSlot, company, message)

    // Create event in Google Calendar (non-blocking - don't fail if this errors)
    try {
      await createCalendarEvent(bookingDate, timeSlot, name, email, company, message, GOOGLE_CALENDAR_ID)
    } catch (calendarError) {
      console.error('Error creating calendar event (booking still saved):', calendarError)
      // Continue - booking is already saved in database
    }

    // Send confirmation email (non-blocking - don't fail if this errors)
    try {
      await sendBookingConfirmationEmail({
        name,
        email,
        date: bookingDate,
        timeSlot,
        company,
      })
    } catch (emailError) {
      console.error('Error sending confirmation email (booking still saved):', emailError)
      // Continue - booking is already saved
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        bookingId: booking.id,
      }),
    }
  } catch (error) {
    console.error('Error creating booking:', error)

    // Handle database constraint errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return {
        statusCode: 409,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: 'This time slot is no longer available',
        }),
      }
    }

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}

