// Netlify serverless function to add or remove a busy day

import { Handler } from '@netlify/functions'
import { addBusyDay, removeBusyDay, isDateBusy } from '../../lib/db/busy-days'
import { parseISO } from 'date-fns'
import { z } from 'zod'

const toggleBusyDaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  action: z.enum(['add', 'remove']),
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
    const body = JSON.parse(event.body || '{}')
    const validationResult = toggleBusyDaySchema.safeParse(body)

    if (!validationResult.success) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: 'Invalid request data',
          details: validationResult.error.errors,
        }),
      }
    }

    const { date, action } = validationResult.data
    const dateObj = parseISO(date)

    if (action === 'add') {
      await addBusyDay(dateObj)
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: true,
          message: 'Busy day added',
        }),
      }
    } else {
      await removeBusyDay(dateObj)
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: true,
          message: 'Busy day removed',
        }),
      }
    }
  } catch (error) {
    console.error('Error toggling busy day:', error)
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

