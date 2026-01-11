// AWS SES email service for sending booking confirmations

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { CONTACT_EMAIL, TIMEZONE } from '../constants'
import { formatInTimeZone } from 'date-fns-tz'

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || 'us-east-1',
  credentials: process.env.SES_ACCESS_KEY_ID && process.env.SES_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
      }
    : undefined,
})

export interface BookingEmailData {
  name: string
  email: string
  date: Date
  timeSlot: string
  company?: string
}

function formatTimeSlot(timeSlot: string): string {
  const [start, end] = timeSlot.split('-')
  if (start === end) {
    return `${start}:00`
  }
  return `${start}:00 - ${end}:00`
}

function formatMeetingDate(date: Date, timeSlot: string): string {
  const [startHour] = timeSlot.split('-').map(Number)
  const meetingDateTime = new Date(date)
  meetingDateTime.setHours(startHour, 0, 0, 0)
  
  return formatInTimeZone(meetingDateTime, TIMEZONE, 'EEEE, MMMM d, yyyy \'at\' HH:mm', {
    timeZone: TIMEZONE,
  })
}

export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<void> {
  const { name, email, date, timeSlot, company } = data
  
  const meetingDate = formatMeetingDate(date, timeSlot)
  const timeSlotFormatted = formatTimeSlot(timeSlot)
  const fromEmail = process.env.SES_FROM_EMAIL || CONTACT_EMAIL
  
  const subject = `Meeting Confirmation - ${meetingDate}`
  
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        .details { background-color: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Meeting Confirmed!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Your meeting has been confirmed. Here are the details:</p>
          
          <div class="details">
            <div class="detail-row">
              <span class="label">Date & Time:</span> ${meetingDate} (Stockholm time)
            </div>
            <div class="detail-row">
              <span class="label">Duration:</span> ${timeSlotFormatted}
            </div>
            ${company ? `<div class="detail-row"><span class="label">Company:</span> ${company}</div>` : ''}
          </div>
          
          <p style="margin-top: 30px;">We look forward to meeting with you!</p>
          <p>Best regards,<br>Brehaut Consulting</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  const textBody = `
Hi ${name},

Your meeting has been confirmed. Here are the details:

Date & Time: ${meetingDate} (Stockholm time)
Duration: ${timeSlotFormatted}
${company ? `Company: ${company}\n` : ''}

We look forward to meeting with you!

Best regards,
Brehaut Consulting
  `.trim()

  try {
    const command = new SendEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: [email],
      },
      ReplyToAddresses: [CONTACT_EMAIL],
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: 'UTF-8',
          },
          Text: {
            Data: textBody,
            Charset: 'UTF-8',
          },
        },
      },
    })

    await sesClient.send(command)
  } catch (error) {
    console.error('Error sending email via AWS SES:', error)
    throw error
  }
}

