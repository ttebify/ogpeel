// Everything that changes when the store and the checkout go live.
export const SITE = 'https://ogpeel.com';
export const SITE_PAGES = { pricing: SITE + '/#pricing', coffee: SITE + '/#coffee', key: SITE + '/key', privacy: SITE + '/privacy' } as const;

export const FREE_PROMPTS = 2;

/** Lemon Squeezy product id for "Unlimited prompts". 0 = not set yet: any key Lemon Squeezy activates is accepted. */
export const LEMON_PRODUCT_ID = 0;
/** Accepted only in a development build, so the unlock flow can be tried before the product exists. */
export const DEV_KEY = 'OGPEEL-TEST-TEST-TEST';
