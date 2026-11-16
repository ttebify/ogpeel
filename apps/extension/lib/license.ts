import { DEV_KEY, LEMON_PRODUCT_ID } from './config';

/**
 * Asks Lemon Squeezy whether a key is real, by activating it for this browser.
 * No server of ours is involved. TODO(before launch): confirm against the current
 * Lemon Squeezy License API docs that /v1/licenses/activate needs no API key.
 */
export async function activateKey(raw: string): Promise<boolean> {
  const key = raw.trim();
  if (!key) return false;
  if (import.meta.env.DEV && key.toUpperCase() === DEV_KEY) return true;
  try {
    const res = await fetch('https://api.lemonsqueezy.com/v1/licenses/activate', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ license_key: key, instance_name: 'Ogpeel browser extension' }),
    });
    const data = await res.json();
    if (!data || data.activated !== true) return false;
    return !LEMON_PRODUCT_ID || data.meta?.product_id === LEMON_PRODUCT_ID;
  } catch {
    return false;
  }
}
