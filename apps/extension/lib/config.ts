// Everything that changes when the store and the checkout go live.
export const SITE = 'https://ogpeel.com';
export const SITE_PAGES = { pricing: SITE + '/#pricing', coffee: SITE + '/#coffee', key: SITE + '/key', privacy: SITE + '/privacy' } as const;

export const FREE_PROMPTS = 2;

/** Public half of the pair the worker signs keys with (`pnpm --filter @ogpeel/worker keygen`). Safe to publish. */
export const LICENSE_PUBLIC_KEY = 'zeFOr5h8OqIncwuUqYhPdtRYVNl+cGqwI2g5UEg1lZY=';
/** Accepted only in a development build, so the unlock flow can be tried before the product exists. */
export const DEV_KEY = 'OGPEEL-TEST-TEST-TEST';
