// Consent Mode v2 defaults: everything denied until the visitor accepts in
// the cookie banner. Inlined in <head> before anything else runs. GTM itself
// is only loaded after consent (see CookieConsent).
//
// It also hides the cookie banner before first paint for visitors who have
// already chosen. The banner is in the server HTML so it paints immediately
// (it's the largest element on phones, so it decides LCP); this keeps it from
// flashing for returning visitors. CookieConsent removes the style once React
// has taken over, so "Cookie settings" can reopen it.
export const CONSENT_HIDE_STYLE_ID = 'bc-consent-hide'
export const consentDefaultsScript = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});try{var c=localStorage.getItem('bc-consent');if(c==='granted'||c==='denied'){var s=document.createElement('style');s.id='${CONSENT_HIDE_STYLE_ID}';s.textContent='.consent{display:none}';document.head.appendChild(s)}}catch(e){}`
