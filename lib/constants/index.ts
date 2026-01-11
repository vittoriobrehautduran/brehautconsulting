// Application constants

export const WORK_DAYS = [1, 2, 3, 4] // Monday-Thursday (0 = Sunday, 1 = Monday, etc.)

export const TIME_SLOTS = ['13-14', '16-17', '18-19'] as const

export type TimeSlot = typeof TIME_SLOTS[number]

export const MAX_BOOKINGS_PER_SLOT = 3

export const TIMEZONE = 'Europe/Stockholm'

export const CONTACT_EMAIL = 'vittorio.brehaut.duran@gmail.com'
export const CONTACT_PHONE = '+46 73 646 30 45'

// Google Calendar ID - use your email address if you shared your calendar with the service account
export const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || CONTACT_EMAIL

// Calendar ID for creating events (with Google Meet links) - defaults to personal calendar
export const EVENT_CREATION_CALENDAR_ID = process.env.EVENT_CREATION_CALENDAR_ID || CONTACT_EMAIL

// Calendar owner email - only events created by this person will be considered for availability
// Leave empty to consider all events in the calendar
export const CALENDAR_OWNER_EMAIL = process.env.CALENDAR_OWNER_EMAIL || CONTACT_EMAIL

// Services extracted from company description
export const SERVICES = [
  {
    title: 'Website & Web Application Development',
    description: 'Design and development of websites and web applications focused on usability, performance, and maintainability.',
  },
  {
    title: 'Conversion & Lead Optimisation',
    description: 'Implementation of conversion and lead optimisation systems, ensuring digital traffic results in real business outcomes.',
  },
  {
    title: 'Local Visibility & SEO',
    description: 'Search optimisation helping businesses be found where customers actively search.',
  },
  {
    title: 'Advertising & Demand Capture',
    description: 'Structured advertising around clear conversion goals rather than vanity metrics.',
  },
  {
    title: 'Analytics & Measurement',
    description: 'Analytics and measurement architecture providing reliable insight into performance and customer behaviour.',
  },
  {
    title: 'Technical Integrations & Automation',
    description: 'Connecting platforms, tools, and workflows to reduce friction and manual work.',
  },
] as const

export const COMPANY_TAGLINE =
  'First-class digital systems for growth.'

