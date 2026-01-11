// Netlify serverless function to create a booking

import { Handler } from '@netlify/functions'
import { prisma } from '../../lib/db/client'
import { WORK_DAYS, TIME_SLOTS, TIMEZONE } from '../../lib/constants'
import { createBooking, isSlotAvailable } from '../../lib/db/bookings'
import { createCalendarEvent } from '../../lib/google-calendar/client'
import { parseDateFromStorage } from '../../lib/google-calendar/utils'
import { sendBookingConfirmationEmail } from '../../lib/email/ses'
import { EVENT_CREATION_CALENDAR_ID } from '../../lib/constants'
import { z } from 'zod'

// Validation schema for booking request
const bookingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  message: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  timeSlot: z.enum(['13-14', '16-16', '18-19'], {
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
    const body = JSON.parse(event.body || '{}')

    // Validate request
    const validationResult = bookingSchema.safeParse(body)
    if (!validationResult.success) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: validationResult.error.errors[0].message,
        }),
      }
    }

    const { name, email, company, message, date, timeSlot } = validationResult.data

    // Parse date string to Date object in Stockholm timezone
    const bookingDate = parseDateFromStorage(date)

    // Check if date is a work day (Monday-Thursday)
    const dayOfWeek = bookingDate.getDay()
    if (!WORK_DAYS.includes(dayOfWeek)) {
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
      await createCalendarEvent(bookingDate, timeSlot, name, email, company, message, EVENT_CREATION_CALENDAR_ID)
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

