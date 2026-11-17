// Everything on the site that changes when the stores and the checkout go live.
// Prices and the refund window are in @ogpeel/pricing, shared with the popup and the key email.

/** Store and checkout links. */
export const LINKS = {
  chrome: '#install',
  edge: '#install',
  safari: '#install',
  checkout: 'https://api.ogpeel.com/buy',
  coffee: 'https://checkout.bachs.io/pay/pl_2488450572b7',
} as const;

/** Where a buyer writes for a lost key. The same address the worker sends keys from (MAIL_FROM), so it must receive mail. */
export const SUPPORT_EMAIL = 'hello@ogpeel.com';
