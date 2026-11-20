// Netlify function: contact form → email the team via SES.
//
// Anti-spam, in order:
//  1. Honeypot field (`fax`) — hidden from people, bots fill it.
//  2. Minimum fill time — a person can't complete the form in under 3 s.
//  3. Rate limit per visitor (hashed IP) and per day (lib/spam/rateLimit).
// Bots caught by 1–2 get a fake "success" so they don't learn to adapt.

import { Handler } from '@netlify/functions'
import { z } from 'zod'
import { sendContactInquiryEmail } from '../../lib/email/ses'
import { allowSubmission, clientIp } from '../../lib/spam/rateLimit'

const MIN_FILL_MS = 3000

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().email('Invalid email address').max(200),
  phone: z.string().trim().min(3, 'Phone is required').max(40),
  company: z.string().trim().min(1, 'Company is required').max(160),
  website: z.string().trim().max(300).optional(),
  interests: z.array(z.string().trim().min(1).max(120)).min(1, 'Pick at least one option').max(10),
  message: z.string().trim().max(5000).optional(),
  // Anti-spam fields — not part of the enquiry.
  fax: z.string().optional(),
  startedAt: z.number().optional(),
})

const corsHeaders = {
  'Content-Type': 'application/json',
}

const json = (statusCode: number, body: Record<string, unknown>) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(body),
})

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { success: false, error: 'Method not allowed' })
  }

  let body: unknown
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { success: false, error: 'Invalid request body' })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return json(400, {
      success: false,
      error: parsed.error.issues[0]?.message || 'Invalid input',
    })
  }

  const data = parsed.data

  // 1–2: silently drop obvious bots.
  // A missing timestamp is allowed (e.g. a page loaded before this deploy);
  // the rate limit below still applies to those.
  const tooFast =
    typeof data.startedAt === 'number' && Date.now() - data.startedAt < MIN_FILL_MS
  if (data.fax || tooFast) {
    return json(200, { success: true })
  }

  // 3: rate limit.
  try {
    const allowed = await allowSubmission(event as never, clientIp(event.headers))
    if (!allowed) {
      return json(429, { success: false, error: 'rate_limited' })
    }
  } catch (error) {
    console.error('rate limit check failed:', error)
  }

  try {
    await sendContactInquiryEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      website: data.website || undefined,
      interests: data.interests,
      message: data.message || undefined,
    })
    return json(200, { success: true })
  } catch (error) {
    console.error('create-contact failed:', error)
    return json(500, { success: false, error: 'Failed to send message' })
  }
}
