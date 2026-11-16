// An Ogpeel key is "OGPEEL-" followed by 72 bytes in URL-safe base64: an 8-byte id
// and an Ed25519 signature over it. Only the holder of the private key can make one;
// anyone with the public key can check one, with no network request.

const PREFIX = 'OGPEEL-';
const ID_BYTES = 8;
const SIGNATURE_BYTES = 64;
const encoder = new TextEncoder();

const fromBase64 = (text: string) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));
const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const signedMessage = (id: Uint8Array) =>
  new Uint8Array([...encoder.encode('ogpeel-unlimited-v1:'), ...id]);

/** A new signing pair, both base64. The private half (PKCS #8) belongs on the server only. */
export async function generateKeys(): Promise<{ publicKey: string; privateKey: string }> {
  const pair = (await crypto.subtle.generateKey('Ed25519', true, [
    'sign',
    'verify',
  ])) as CryptoKeyPair;
  return {
    publicKey: toBase64(new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey))),
    privateKey: toBase64(new Uint8Array(await crypto.subtle.exportKey('pkcs8', pair.privateKey))),
  };
}

/** Makes the key for one payment. The same seed (a payment id) always gives the same key. */
export async function signKey(privateKey: string, seed: string): Promise<string> {
  const key = await crypto.subtle.importKey('pkcs8', fromBase64(privateKey), 'Ed25519', false, [
    'sign',
  ]);
  const id = new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(seed))).slice(
    0,
    ID_BYTES,
  );
  const signature = new Uint8Array(await crypto.subtle.sign('Ed25519', key, signedMessage(id)));
  return (
    PREFIX +
    toBase64(new Uint8Array([...id, ...signature]))
      .replaceAll('+', '-')
      .replaceAll('/', '_')
  );
}

/** True when the key was signed by the private half of `publicKey`. Never throws. */
export async function verifyKey(publicKey: string, key: string): Promise<boolean> {
  try {
    const text = key.replace(/\s/g, '');
    if (!text.startsWith(PREFIX)) return false;
    const bytes = fromBase64(text.slice(PREFIX.length).replaceAll('-', '+').replaceAll('_', '/'));
    if (bytes.length !== ID_BYTES + SIGNATURE_BYTES) return false;
    const verifier = await crypto.subtle.importKey('raw', fromBase64(publicKey), 'Ed25519', false, [
      'verify',
    ]);
    return await crypto.subtle.verify(
      'Ed25519',
      verifier,
      bytes.slice(ID_BYTES),
      signedMessage(bytes.slice(0, ID_BYTES)),
    );
  } catch {
    return false;
  }
}
