// Netlify serverless function to add busy times to Google Calendar

import { Handler } from '@netlify/functions'
import { createBusyTimeEvent } from '../../lib/google-calendar/client'
import { GOOGLE_CALENDAR_ID } from '../../lib/constants'
import { toZonedTime } from 'date-fns-tz'
import { TIMEZONE } from '../../lib/constants'
import { addDays, format, parseISO } from 'date-fns'

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
    const body = JSON.parse(event.body || '{}')
    const { startDate, endDate } = body

    if (!startDate || !endDate) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: 'Start date and end date are required',
        }),
      }
    }

    // Parse dates
    const start = parseISO(startDate)
    const end = parseISO(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: 'Invalid date format',
        }),
      }
    }

    if (start > end) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: 'Start date must be before or equal to end date',
        }),
      }
    }

    // Convert dates to Stockholm timezone
    const startZoned = toZonedTime(start, TIMEZONE)
    const endZoned = toZonedTime(end, TIMEZONE)

    // Create events for each day in the range (inclusive)
    let daysCreated = 0
    let currentDate = startZoned

    while (currentDate <= endZoned) {
      try {
        await createBusyTimeEvent(currentDate, GOOGLE_CALENDAR_ID)
        daysCreated++
      } catch (error) {
        console.error(`Error creating busy event for ${format(currentDate, 'yyyy-MM-dd')}:`, error)
        // Continue with other dates even if one fails
      }
      currentDate = addDays(currentDate, 1)
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        daysCreated,
      }),
    }
  } catch (error) {
    console.error('Error adding busy times:', error)
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

