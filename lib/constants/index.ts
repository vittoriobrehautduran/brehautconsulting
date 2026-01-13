// Application constants

export const WORK_DAYS = [1, 2, 3, 4] // Monday-Thursday (0 = Sunday, 1 = Monday, etc.)

export const TIME_SLOTS = ['13-14', '16-16', '18-19'] as const

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
    description: 'Design and development of modern websites and web applications built to support real business goals — not just visual presentation. Every solution is structured around usability, performance, and maintainability, with a clear focus on guiding visitors toward enquiries, bookings, or actions that matter to the business.',
  },
  {
    title: 'Conversion & Lead Optimisation',
    description: 'Improving how visitors interact with your website so more people take action — contact you, book a meeting, or make a purchase. This focuses on reducing friction, clarifying messaging, and aligning the site with how real customers make decisions, turning traffic into measurable business results.',
  },
  {
    title: 'Local Visibility & SEO',
    description: 'Search optimisation that helps your business appear where customers actively search for your services. This includes structuring your website and presence so you are visible on Google and map services at the moment potential customers are looking — not just ranking, but relevance.',
  },
  {
    title: 'Advertising & Demand Capture',
    description: 'Structured advertising designed to capture existing demand, not chase vanity metrics. Campaigns are built around clear conversion goals, targeting people who are already ready to enquire, book, or buy — with full visibility into what actually generates results.',
  },
  {
    title: 'Analytics & Measurement',
    description: 'Analytics and measurement architecture that shows what\'s working and what isn\'t. This provides clear insight into customer behaviour and performance, allowing decisions to be based on data instead of guesswork — and enabling continuous improvement over time.',
  },
  {
    title: 'Technical Integrations & Automation',
    description: 'Connecting platforms, tools, and workflows to reduce manual work and operational friction. From forms and bookings to email and internal systems, integrations are designed to improve efficiency, reliability, and the overall customer journey.',
  },
] as const

export const COMPANY_TAGLINE =
  'Clear, measurable digital systems for customer growth.'

