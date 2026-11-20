// Netlify function: redesign contact form → email the team via SES.

import { Handler } from '@netlify/functions'
import { z } from 'zod'
import { sendContactInquiryEmail } from '../../lib/email/ses'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(3, 'Phone is required'),
  company: z.string().min(1, 'Company is required'),
  website: z.string().optional(),
  interests: z.array(z.string().min(1)).min(1, 'Pick at least one option'),
  message: z.string().optional(),
})

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    }
  }

  try {
    let body: unknown
    try {
      body = JSON.parse(event.body || '{}')
    } catch {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, error: 'Invalid request body' }),
      }
    }

    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: parsed.error.errors[0]?.message || 'Invalid input',
        }),
      }
    }

    const data = parsed.data
    await sendContactInquiryEmail({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      company: data.company.trim(),
      website: data.website?.trim() || undefined,
      interests: data.interests.map((item) => item.trim()),
      message: data.message?.trim() || undefined,
    })

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true }),
    }
  } catch (error) {
    console.error('create-contact failed:', error)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to send message',
      }),
    }
  }
}
