// AWS SES email service for contact form enquiries.

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { CONTACT_EMAIL } from '../constants'

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || 'us-east-1',
  credentials: process.env.SES_ACCESS_KEY_ID && process.env.SES_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
      }
    : undefined,
})

export interface ContactInquiryEmailData {
  name: string
  email: string
  phone: string
  company: string
  website?: string
  interests: string[]
  message?: string
}

// Form input is untrusted — escape it before it goes into the HTML email.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Notify the team when someone submits the contact form.
export async function sendContactInquiryEmail(
  data: ContactInquiryEmailData
): Promise<void> {
  const { name, email, phone, company, website, interests, message } = data
  const fromEmail = process.env.SES_FROM_EMAIL || CONTACT_EMAIL
  const subject = `New enquiry from ${(company || name).replace(/[\r\n]+/g, ' ')}`

  const interestList = interests.map((item) => `• ${item}`).join('\n')
  const textBody = `
New contact enquiry

Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company}
${website ? `Website: ${website}\n` : ''}
Interested in:
${interestList}

${message ? `Message:\n${message}\n` : ''}
  `.trim()

  const e = escapeHtml
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
      <h2>New contact enquiry</h2>
      <p><strong>Name:</strong> ${e(name)}<br>
      <strong>Email:</strong> ${e(email)}<br>
      <strong>Phone:</strong> ${e(phone)}<br>
      <strong>Company:</strong> ${e(company)}<br>
      ${website ? `<strong>Website:</strong> ${e(website)}<br>` : ''}
      </p>
      <p><strong>Interested in:</strong></p>
      <ul>${interests.map((item) => `<li>${e(item)}</li>`).join('')}</ul>
      ${message ? `<p><strong>Message:</strong><br>${e(message).replace(/\n/g, '<br>')}</p>` : ''}
    </body>
    </html>
  `

  try {
    const command = new SendEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: [CONTACT_EMAIL],
      },
      ReplyToAddresses: [email],
      Message: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: {
          Html: { Data: htmlBody, Charset: 'UTF-8' },
          Text: { Data: textBody, Charset: 'UTF-8' },
        },
      },
    })
    await sesClient.send(command)
  } catch (error) {
    console.error('Error sending contact enquiry via AWS SES:', error)
    throw error
  }
}
