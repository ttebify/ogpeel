import { verifyKey } from '@ogpeel/license';
import { DEV_KEY, LICENSE_PUBLIC_KEY } from './config';

/** Checks a key on this device, against the signature the Ogpeel worker put in it. Nothing is sent anywhere. */
export async function activateKey(raw: string): Promise<boolean> {
  const key = raw.trim();
  if (!key) return false;
  if (import.meta.env.DEV && key.toUpperCase() === DEV_KEY) return true;
  return verifyKey(LICENSE_PUBLIC_KEY, key);
}
