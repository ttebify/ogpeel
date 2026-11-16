// Everything on the site that changes when the stores and the checkout go live.
// Prices and the refund window are in @ogpeel/pricing, shared with the popup and the key email.

/** Store and checkout links. Not live yet, so they point at the section that will hold them. */
export const LINKS = {
  chrome: '#install',
  edge: '#install',
  safari: '#install',
  checkout: 'https://api.ogpeel.com/buy',
  coffee: '#coffee',
} as const;

/** Where a buyer writes for a lost key. The same address the worker sends keys from (MAIL_FROM), so it must receive mail. */
export const SUPPORT_EMAIL = 'hello@ogpeel.com';
