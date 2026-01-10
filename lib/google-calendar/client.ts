// Google Calendar API client using Service Account authentication

import { google } from 'googleapis'
import { TIMEZONE } from '@/lib/constants'

let calendarClient: ReturnType<typeof google.calendar> | null = null

// Initialize Google Calendar client with service account
function getCalendarClient() {
  if (calendarClient) {
    return calendarClient
  }

  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set')
  }

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
    scopes: [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events',
    ],
  })

  calendarClient = google.calendar({ version: 'v3', auth })
  return calendarClient
}

// Get busy times for a specific date range
export async function getBusyTimes(startDate: Date, endDate: Date, calendarId?: string) {
  const calendar = getCalendarClient()
  const primaryCalendarId = calendarId || 'primary'

  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        items: [{ id: primaryCalendarId }],
      },
    })

    const busyPeriods = response.data.calendars?.[primaryCalendarId]?.busy || []
    return busyPeriods
  } catch (error) {
    console.error('Error fetching busy times from Google Calendar:', error)
    throw error
  }
}

// Create an event in Google Calendar
export async function createCalendarEvent(
  date: Date,
  timeSlot: string,
  name: string,
  email: string,
  company?: string,
  message?: string,
  calendarId?: string
) {
  const calendar = getCalendarClient()
  const primaryCalendarId = calendarId || 'primary'

  // Parse time slot (e.g., "13-14" -> 13:00 and 14:00)
  const [startHour, endHour] = timeSlot.split('-').map(Number)

  // Create date objects in Stockholm timezone
  const startDateTime = new Date(date)
  startDateTime.setHours(startHour, 0, 0, 0)

  const endDateTime = new Date(date)
  endDateTime.setHours(endHour, 0, 0, 0)

  // Convert to ISO strings (Calendar API expects UTC)
  const startTimeISO = startDateTime.toISOString()
  const endTimeISO = endDateTime.toISOString()

  const title = company ? `Meeting: ${name} (${company})` : `Meeting: ${name}`
  const description = `Email: ${email}${message ? `\n\nMessage: ${message}` : ''}`

  try {
    const response = await calendar.events.insert({
      calendarId: primaryCalendarId,
      requestBody: {
        summary: title,
        description: description,
        start: {
          dateTime: startTimeISO,
          timeZone: TIMEZONE,
        },
        end: {
          dateTime: endTimeISO,
          timeZone: TIMEZONE,
        },
      },
    })

    return response.data
  } catch (error) {
    console.error('Error creating calendar event:', error)
    throw error
  }
}

// Check if a time slot overlaps with busy periods
export function isTimeSlotBusy(timeSlot: string, busyPeriods: Array<{ start: string; end: string }>): boolean {
  const [startHour, endHour] = timeSlot.split('-').map(Number)

  return busyPeriods.some((period) => {
    const periodStart = new Date(period.start)
    const periodEnd = new Date(period.end)

    const slotStartHour = periodStart.getHours()
    const slotEndHour = periodEnd.getHours()

    // Check if the busy period overlaps with our time slot
    // Busy period overlaps if it starts before our slot ends and ends after our slot starts
    return (
      (slotStartHour < endHour && slotEndHour > startHour) ||
      (slotStartHour === startHour) ||
      (slotEndHour === endHour)
    )
  })
}

