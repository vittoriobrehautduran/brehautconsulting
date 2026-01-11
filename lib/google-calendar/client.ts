// Google Calendar API client using Service Account authentication

import { google } from 'googleapis'
import { TIMEZONE, GOOGLE_CALENDAR_ID, EVENT_CREATION_CALENDAR_ID, CALENDAR_OWNER_EMAIL } from '@/lib/constants'

let calendarClient: ReturnType<typeof google.calendar> | null = null
let serviceAccountEmail: string | null = null

// Get service account email from credentials
function getServiceAccountEmail(): string | null {
  if (serviceAccountEmail) {
    return serviceAccountEmail
  }

  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    return null
  }

  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
    serviceAccountEmail = credentials.client_email || null
    return serviceAccountEmail
  } catch {
    return null
  }
}

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
// Checks both the family calendar and the event creation calendar
// Filters events to only include those created by vittoriobre@gmail.com, vittorio.brehaut.duran@gmail.com, or the service account
export async function getBusyTimes(startDate: Date, endDate: Date, calendarId?: string) {
  const calendar = getCalendarClient()
  const primaryCalendarId = calendarId || GOOGLE_CALENDAR_ID

  try {
    // List of emails to filter for
    const allowedEmails = [
      'vittoriobre@gmail.com',
      'vittorio.brehaut.duran@gmail.com',
    ]
    
    const serviceAccountEmail = getServiceAccountEmail()
    if (serviceAccountEmail) {
      allowedEmails.push(serviceAccountEmail)
    }
    
    // Convert to lowercase for case-insensitive comparison
    const allowedEmailsLower = allowedEmails.map(email => email.toLowerCase())
    
    // Check both calendars: the family calendar and the event creation calendar
    const calendarsToCheck = [primaryCalendarId]
    if (EVENT_CREATION_CALENDAR_ID !== primaryCalendarId) {
      calendarsToCheck.push(EVENT_CREATION_CALENDAR_ID)
    }
    
    // Get events from all calendars
    const allEvents = []
    for (const calId of calendarsToCheck) {
      try {
        const response = await calendar.events.list({
          calendarId: calId,
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
        })
        allEvents.push(...(response.data.items || []))
      } catch (calError) {
        // If one calendar fails, continue with the other
        console.error(`Error fetching events from calendar ${calId}:`, calError)
      }
    }
    
    // Filter events to only include those created/organized by allowed emails
    const filteredEvents = allEvents.filter((event) => {
      const organizerEmail = event.organizer?.email?.toLowerCase()
      const creatorEmail = event.creator?.email?.toLowerCase()
      
      // Check if organizer or creator matches any of the allowed emails
      return (
        (organizerEmail && allowedEmailsLower.includes(organizerEmail)) ||
        (creatorEmail && allowedEmailsLower.includes(creatorEmail))
      )
    })

    // Convert events to busy periods
    const busyPeriods = filteredEvents
      .filter((event) => event.start?.dateTime && event.end?.dateTime)
      .map((event) => ({
        start: event.start!.dateTime!,
        end: event.end!.dateTime!,
      }))

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
  const primaryCalendarId = calendarId || EVENT_CREATION_CALENDAR_ID

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

