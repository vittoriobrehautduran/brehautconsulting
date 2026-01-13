// Netlify serverless function to get all busy days

import { Handler } from '@netlify/functions'
import { getAllBusyDays } from '../../lib/db/busy-days'

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
    const busyDays = await getAllBusyDays()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        busyDays: busyDays.map((day) => ({
          id: day.id,
          date: day.date.toISOString(),
        })),
      }),
    }
  } catch (error) {
    console.error('Error fetching busy days:', error)
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

