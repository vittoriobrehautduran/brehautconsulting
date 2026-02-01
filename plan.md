# Brehaut Consulting Website - Technical Implementation Plan

## Executive Summary

Build a modern, dark-themed company website using Next.js with Material-UI, featuring a booking system that integrates with Google Calendar. The site will be hosted on Netlify with serverless functions, using Neon PostgreSQL database, and implementing advanced SEO practices.

---

## 1. Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
  - **Rationale**: Server-side rendering and static generation for optimal SEO, built-in API routes, excellent Netlify integration
- **UI Library**: Material-UI (MUI) v5+
  - **Rationale**: Comprehensive component library with dark theme support, consistent design system
- **Styling**: MUI's theme system + CSS Modules (if needed)
  - **Rationale**: Built-in theming for dark mode, easy customization

### Backend/API
- **Serverless Functions**: Netlify Functions
  - **Rationale**: Native Netlify integration, serverless architecture, cost-effective for low-medium traffic
- **Runtime**: Node.js (via Netlify Functions)

### Database
- **Primary Database**: Neon PostgreSQL
  - **Rationale**: Serverless PostgreSQL, perfect for Netlify deployments, automatic scaling
- **ORM/Query Builder**: Prisma or Drizzle ORM
  - **Rationale**: Type-safe database access, migrations, excellent TypeScript support
  - **Recommendation**: Prisma (better ecosystem, easier migrations)

### External Integrations
- **Google Calendar API**: Service Account authentication
  - **Rationale**: Server-side only, no user interaction needed, simpler than OAuth
  - **Implementation**: Service account JSON key stored as Netlify environment variable

### Deployment & Infrastructure
- **Hosting**: Netlify
  - **Rationale**: Seamless Next.js deployment, built-in serverless functions, edge network
- **Environment Variables**: Netlify environment variables (for secrets)

### SEO & Analytics
- **Meta Tags**: Next.js Metadata API
- **Schema Markup**: JSON-LD structured data
- **Sitemap**: Next.js built-in sitemap generation
- **Robots.txt**: Next.js built-in generation

---

## 2. Project Structure

```
brehaut-consulting/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with MUI theme provider
│   ├── page.tsx                 # Home page
│   ├── booking/
│   │   └── page.tsx             # Booking page component
│   ├── api/                     # Next.js API routes (if needed)
│   └── sitemap.ts               # Dynamic sitemap generation
│
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   │   ├── Calendar.tsx        # Calendar booking component
│   │   ├── BookingForm.tsx     # Booking form fields
│   │   └── ...
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   └── sections/                # Page sections
│       ├── Hero.tsx
│       ├── Services.tsx
│       └── ...
│
├── lib/                         # Utility libraries
│   ├── db/                      # Database client & queries
│   │   ├── client.ts           # Prisma client instance
│   │   ├── bookings.ts         # Booking queries
│   │   └── ...
│   ├── google-calendar/         # Google Calendar integration
│   │   ├── client.ts           # Google Calendar API client
│   │   └── utils.ts            # Calendar utility functions
│   ├── utils/                   # General utilities
│   └── constants/               # App constants
│
├── prisma/                      # Prisma schema & migrations
│   ├── schema.prisma
│   └── migrations/
│
├── netlify/
│   └── functions/               # Netlify serverless functions
│       ├── get-available-slots.ts
│       └── create-booking.ts
│
├── public/                      # Static assets
│   ├── images/
│   └── favicon.ico
│
├── types/                       # TypeScript types
│   └── booking.ts
│
├── .env.local                   # Local environment variables
├── .env.example                 # Example env file
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## 3. Database Schema

### Bookings Table
```prisma
model Booking {
  id            String   @id @default(cuid())
  name          String
  email         String
  company       String?
  message       String?
  date          DateTime  // Date only (time ignored)
  timeSlot      String    // "13-14", "16-17", or "18-19"
  status        String    @default("confirmed") // "confirmed", "cancelled"
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([date, timeSlot])
  @@index([email])
}
```

### Rationale
- Store date and time slot separately for easier querying
- Index on date+timeSlot for fast availability checks
- Index on email for lookup purposes
- Status field allows future cancellation functionality
- Uses CUID for IDs (URL-friendly, collision-resistant)

---

## 4. API Design & Serverless Functions

### Netlify Function: `get-available-slots`

**Endpoint**: `/.netlify/functions/get-available-slots`

**Method**: GET

**Query Parameters**:
- `date` (required): ISO date string (YYYY-MM-DD)

**Response**:
```typescript
{
  date: string;
  availableSlots: Array<{
    timeSlot: "13-14" | "16-17" | "18-19";
    available: boolean;
  }>;
}
```

**Logic Flow**:
1. Validate date parameter (must be Monday-Thursday)
2. Get all three default slots: ["13-14", "16-17", "18-19"]
3. Query database for existing bookings on that date
4. Check if any slots already have 3 bookings (max limit)
5. Call Google Calendar API to get busy times for that date
6. Convert Google Calendar events to time slots (13-14, 16-17, 18-19)
7. Remove busy slots from available slots
8. Return remaining available slots

**Error Handling**:
- Invalid date format → 400 Bad Request
- Date not Monday-Thursday → 400 Bad Request
- Google Calendar API error → 500 with fallback (assume all slots available or return error)
- Database error → 500 Internal Server Error

---

### Netlify Function: `create-booking`

**Endpoint**: `/.netlify/functions/create-booking`

**Method**: POST

**Request Body**:
```typescript
{
  name: string;
  email: string;
  company?: string;
  message?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  timeSlot: "13-14" | "16-17" | "18-19";
}
```

**Response**:
```typescript
{
  success: boolean;
  bookingId?: string;
  error?: string;
}
```

**Logic Flow**:
1. Validate all required fields
2. Validate date is Monday-Thursday
3. Validate timeSlot is one of the allowed values
4. Check if slot is still available (query database + Google Calendar)
5. Check if slot hasn't reached 3 bookings limit
6. Insert booking into database
7. Create event in Google Calendar (optional but recommended for sync)
8. Return success response with booking ID

**Error Handling**:
- Validation errors → 400 Bad Request
- Slot not available → 409 Conflict
- Slot at capacity (3 bookings) → 409 Conflict
- Database error → 500 Internal Server Error
- Google Calendar creation error → Log error but still confirm booking (idempotent operation)

---

## 5. Google Calendar Integration

### Service Account Setup
1. Create Google Cloud Project
2. Enable Google Calendar API
3. Create Service Account
4. Download JSON key file
5. Share personal Google Calendar with Service Account email (read/write access)
6. Store JSON key content in Netlify environment variable (base64 encoded or as JSON string)

### Implementation Details

**Libraries**: `googleapis` npm package

**Authentication**:
```typescript
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
  scopes: ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events']
});

const calendar = google.calendar({ version: 'v3', auth });
```

**Getting Busy Times**:
- Use `calendar.freebusy.query()` with timeMin/timeMax for the specific date
- Convert busy periods to time slots (13-14, 16-17, 18-19)
- Handle timezone: Convert Stockholm timezone to UTC for API calls

**Creating Events**:
- When booking is created, create event in Google Calendar
- Title: "Meeting: {name} ({company})"
- Description: Include email and message if provided
- Time: Based on date + timeSlot (convert to Stockholm timezone)

**Timezone Handling**:
- Store all times in UTC in database
- Convert user-facing times to Stockholm (Europe/Stockholm) timezone
- Google Calendar API uses UTC, so convert accordingly

---

## 6. Frontend Components

### Booking Page (`/booking`)

**Components**:
- `Calendar.tsx`: Date picker (MUI DatePicker or custom)
  - Disable weekends and Friday-Sunday
  - Show only Monday-Thursday dates
  - Fetch and display available slots per selected date
  
- `TimeSlotSelector.tsx`: Time slot selection
  - Display three time slots: 13:00-14:00, 16:00-17:00, 18:00-19:00
  - Disable unavailable slots
  - Visual feedback for selected slot
  
- `BookingForm.tsx`: Form fields (MUI TextField components)
  - Name (required)
  - Email (required, validation)
  - Company (optional)
  - Message (optional, multiline)
  - Submit button

**State Management**:
- React useState for form state
- React Query or SWR for API calls (recommended: SWR for simplicity)
- Loading states and error handling

**User Flow**:
1. User selects a date (Monday-Thursday only)
2. System fetches available slots for that date
3. User selects an available time slot
4. User fills in booking form
5. On submit, create booking via API
6. Show success/error message

---

### Home Page (`/`)

**Sections** (can be separate components):
- **Hero Section**: Company name, main tagline ("First-class websites and web applications, growth systems, and technical integrations for conversion optimisation, local visibility, SEO, advertising, analytics, and automation."), CTA button to booking
- **Services Section**: Overview of services (from company description)
- **About Section**: Brief company info
- **CTA Section**: Booking CTA

**Design**:
- Dark theme (MUI dark mode)
- Clean, modern, tech-focused aesthetic
- Minimal animations (as requested)

---

## 7. SEO Implementation

### Metadata (Next.js Metadata API)

**Home Page**:
```typescript
export const metadata = {
  title: "Brehaut Consulting | Technology & Growth Consultancy",
  description: "First-class websites and web applications, growth systems, and technical integrations for conversion optimisation, local visibility, SEO, advertising, analytics, and automation.",
  keywords: "technology consultancy, growth consultancy, web development, digital systems",
  openGraph: {
    title: "Brehaut Consulting | Technology & Growth Consultancy",
    description: "...",
    type: "website",
    locale: "en_US",
    // Add OG image URL
  },
  twitter: {
    card: "summary_large_image",
    title: "...",
    description: "...",
    // Add Twitter image
  },
}
```

**Booking Page**:
- Similar metadata structure
- Canonical URL
- No-index if desired (or index if you want it indexed)

### Schema Markup (JSON-LD)

**Organization Schema** (on home page):
```json
{
  "@context": "https://schema.org",
  "@type": "ConsultingService",
  "name": "Brehaut Consulting",
  "description": "First-class websites and web applications, growth systems, and technical integrations for conversion optimisation, local visibility, SEO, advertising, analytics, and automation.",
  "serviceType": "Technology and Growth Consultancy",
  "areaServed": ["Europe", "Latin America"],
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://brehautconsulting.com/booking"
  }
}
```

**Service Schema** (on home page):
- Multiple Service schemas for each service offering
- Include description, area served, etc.

**Breadcrumb Schema** (on booking page):
- Simple breadcrumb navigation structure

### Sitemap

**Implementation**: Next.js `app/sitemap.ts`
- Home page
- Booking page
- Set appropriate priorities and change frequencies

### Robots.txt

**Implementation**: Next.js `app/robots.ts`
- Allow all crawlers
- Point to sitemap URL

### Technical SEO

- Semantic HTML5 elements
- Proper heading hierarchy (h1, h2, h3)
- Alt text for all images
- Fast page load (optimize images, code splitting)
- Mobile-responsive design (MUI handles this)
- Accessible components (MUI components are accessible)

---

## 8. MUI Dark Theme Configuration

### Theme Setup

```typescript
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#...', // Choose tech-focused color (e.g., cyan, blue, or green)
    },
    background: {
      default: '#0a0a0a', // Very dark background
      paper: '#1a1a1a', // Slightly lighter for cards
    },
    // Customize other colors as needed
  },
  typography: {
    fontFamily: '...', // Modern tech font (e.g., Inter, Space Grotesk)
  },
  // Add custom component overrides
});
```

**Rationale**: Dark theme creates modern, tech-focused aesthetic. Customize colors to match brand identity.

---

## 9. Environment Variables

### Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@neon-host/dbname"

# Google Calendar
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'  # Full JSON as string

# Optional: Email service (if implementing email confirmations)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

# App
NEXT_PUBLIC_SITE_URL="https://brehautconsulting.com"
```

---

## 10. Deployment Strategy

### Netlify Configuration

**`netlify.toml`**:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
```

### Build Process
1. Build Next.js app
2. Netlify automatically detects serverless functions
3. Set environment variables in Netlify dashboard
4. Deploy

### Database Migrations
- Run Prisma migrations as part of build process (optional)
- Or run migrations manually before deployment
- Consider using Prisma Migrate Deploy in production

---

## 11. Risk Assessment & Mitigation

### Risks

1. **Google Calendar API Rate Limits**
   - **Risk**: Too many API calls could hit rate limits
   - **Mitigation**: Implement caching (5-10 minute cache for availability checks), use freebusy API efficiently

2. **Database Connection Pooling**
   - **Risk**: Serverless functions may exhaust database connections
   - **Mitigation**: Use Neon's connection pooling, configure Prisma connection limits appropriately

3. **Timezone Confusion**
   - **Risk**: Booking times stored incorrectly due to timezone issues
   - **Mitigation**: Always convert to UTC in database, use timezone-aware libraries (date-fns-tz), clearly document timezone handling

4. **Double Booking**
   - **Risk**: Race condition where two users book same slot simultaneously
   - **Mitigation**: Database constraints (unique index on date+timeSlot with count check), transaction locks, or application-level validation with retry logic

5. **Service Account Key Security**
   - **Risk**: Service account key exposed
   - **Mitigation**: Store in Netlify environment variables (encrypted), never commit to git, use .env.example

6. **SEO Performance**
   - **Risk**: Poor Core Web Vitals affecting SEO
   - **Mitigation**: Optimize images, code splitting, monitor performance, use Next.js Image component

---

## 12. Development Phases

### Phase 1: Foundation
- Set up Next.js project with MUI
- Configure dark theme
- Set up database (Neon) and Prisma
- Create database schema and migrations
- Basic home page layout

### Phase 2: Booking System Backend
- Set up Netlify Functions
- Implement Google Calendar integration (service account)
- Create `get-available-slots` function
- Create `create-booking` function
- Test API endpoints

### Phase 3: Booking Frontend
- Build calendar date picker
- Build time slot selector
- Build booking form
- Connect frontend to backend APIs
- Handle errors and loading states

### Phase 4: SEO & Polish
- Implement metadata for all pages
- Add schema markup
- Generate sitemap and robots.txt
- Optimize images and performance
- Test SEO tools (Google Rich Results, etc.)

### Phase 5: Testing & Deployment
- Test booking flow end-to-end
- Test Google Calendar sync
- Test timezone handling
- Deploy to Netlify staging
- Final testing and production deployment

---

## 13. Future Considerations (Out of Scope)

- Admin panel for viewing/managing bookings
- Email confirmations (booker and owner)
- Cancellation/rescheduling functionality
- Multi-language support
- Blog/resources section
- Case studies/portfolio section
- Analytics integration (Google Analytics, etc.)
- A/B testing for CTAs

---

## 14. Key Technical Decisions Summary

1. **Next.js App Router**: Modern Next.js features, better SEO, improved performance
2. **Material-UI**: Comprehensive component library, dark theme support, accessibility
3. **Netlify Functions**: Serverless backend, native Netlify integration, cost-effective
4. **Neon PostgreSQL**: Serverless database, great for serverless architectures
5. **Prisma ORM**: Type-safe database access, migrations, excellent DX
6. **Service Account Auth**: Simpler than OAuth for server-side calendar access
7. **UTC Storage**: Store all dates/times in UTC, convert to Stockholm timezone for display
8. **JSON-LD Schema**: Modern, recommended approach for structured data

---

## Next Steps

1. Review and confirm this plan
2. Set up development environment
3. Create GitHub repository
4. Begin Phase 1 implementation

