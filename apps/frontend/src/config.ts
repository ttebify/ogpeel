// Everything on the site that changes when the stores and the checkout go live.
// Prices and the refund window are in @ogpeel/pricing, shared with the popup and the key email.

/** Store and checkout links. */
export const LINKS = {
  chrome: 'https://chromewebstore.google.com/detail/jblomcmfnidepcijecnmfnpchkmcneli',
  // Edge installs from the Chrome Web Store until it has its own listing.
  edge: 'https://chromewebstore.google.com/detail/jblomcmfnidepcijecnmfnpchkmcneli',
  /** Empty until the Safari version is out; the button then says it is coming. */
  safari: '',
  checkout: 'https://api.ogpeel.com/buy',
  coffee: 'https://checkout.bachs.io/pay/pl_2488450572b7',
} as const;

/** The product video on YouTube. Its poster is public/product-video-poster.jpg. */
export const VIDEO = { id: 'IWw3EUP1pn8', length: '0:44' } as const;

/** Where a buyer writes for a lost key. The same address the worker sends keys from (MAIL_FROM), so it must receive mail. */
export const SUPPORT_EMAIL = 'hello@ogpeel.com';
