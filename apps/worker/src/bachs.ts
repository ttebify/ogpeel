// The two things Ogpeel needs from Bachs: a checkout to send the buyer to,
// and proof that a webhook really came from Bachs.

import type { Env } from '@/env';

const TOLERANCE_SECONDS = 300;
const encoder = new TextEncoder();

/** Creates a hosted checkout for one product and returns its URL. */
export async function createCheckout(env: Env): Promise<string> {
  const res = await fetch(env.BACHS_API_URL + '/v1/checkout-sessions', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + env.BACHS_SECRET_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_cart: [{ product_id: env.BACHS_PRODUCT_ID }],
      success_url: env.SUCCESS_URL,
    }),
  });
  if (!res.ok) throw new Error('Bachs checkout failed: ' + res.status);
  const { checkout_url } = (await res.json()) as { checkout_url: string };
  return checkout_url;
}

/**
 * Checks the X-Bachs-Signature-V2 header, "t={timestamp},v1={signature}[,v1=...]":
 * each v1 is the hex HMAC-SHA256 of "{timestamp}.{raw body}" under a signing secret.
 */
export async function verifyWebhook(
  secret: string,
  header: string | null,
  body: string,
  now = Date.now(),
): Promise<boolean> {
  const parts = (header ?? '').split(',').map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith('t='))?.slice(2);
  const signatures = parts.filter((part) => part.startsWith('v1=')).map((part) => part.slice(3));
  if (!timestamp || !(Math.abs(now / 1000 - Number(timestamp)) <= TOLERANCE_SECONDS)) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const message = encoder.encode(timestamp + '.' + body);
  for (const signature of signatures) {
    if (!/^([0-9a-f]{2})+$/i.test(signature)) continue;
    const bytes = Uint8Array.from(signature.match(/../g)!, (pair) => parseInt(pair, 16));
    if (await crypto.subtle.verify('HMAC', key, bytes, message)) return true;
  }
  return false;
}
