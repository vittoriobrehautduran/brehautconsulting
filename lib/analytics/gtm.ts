// Google Tag Manager dataLayer utility
// Handles GTM event tracking

declare global {
  interface Window {
    dataLayer: any[]
  }
}

// Initialize dataLayer if it doesn't exist
if (typeof window !== 'undefined' && !window.dataLayer) {
  window.dataLayer = []
}

// Push event to dataLayer
export function pushToDataLayer(event: string, data?: Record<string, any>) {
  if (typeof window === 'undefined') return

  const eventData: any = { event }
  if (data) {
    Object.assign(eventData, data)
  }

  window.dataLayer.push(eventData)
}

// Track lead started (when the contact form is shown)
export function trackLeadStarted() {
  pushToDataLayer('lead_started')
}

// Track lead submitted (when the contact form is sent successfully)
export function trackLeadSubmitted() {
  pushToDataLayer('lead_submitted')
}

