// Consent Mode v2 defaults: everything denied until the visitor accepts in
// the cookie banner. Inlined in <head> before anything else runs. GTM itself
// is only loaded after consent (see CookieConsent).
export const consentDefaultsScript = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});`
