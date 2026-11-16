import { describe, expect, it } from 'vitest';
import { generateKeys, signKey, verifyKey } from './index';

describe('license keys', async () => {
  const { publicKey, privateKey } = await generateKeys();
  const key = await signKey(privateKey, 'ch_1a2b3c4d5e6f');

  it('accepts a key it signed', async () => {
    expect(key).toMatch(/^OGPEEL-[A-Za-z0-9_-]{96}$/);
    expect(await verifyKey(publicKey, key)).toBe(true);
  });

  it('gives the same key for the same payment and another for a different one', async () => {
    expect(await signKey(privateKey, 'ch_1a2b3c4d5e6f')).toBe(key);
    expect(await signKey(privateKey, 'ch_other')).not.toBe(key);
  });

  it('accepts a key pasted with spaces or line breaks in it', async () => {
    expect(await verifyKey(publicKey, `  ${key.slice(0, 40)}\n${key.slice(40)} `)).toBe(true);
  });

  it('rejects a changed key', async () => {
    const swapped = key.slice(0, 20) + (key[20] === 'A' ? 'B' : 'A') + key.slice(21);
    expect(await verifyKey(publicKey, swapped)).toBe(false);
  });

  it('rejects a key signed by someone else', async () => {
    const other = await generateKeys();
    expect(await verifyKey(publicKey, await signKey(other.privateKey, 'ch_1a2b3c4d5e6f'))).toBe(false);
  });

  it('rejects anything that is not a key', async () => {
    for (const junk of ['', 'OGPEEL-TEST-TEST-TEST', 'OGPEEL-', 'hello', key.slice(0, -4), key.replace('OGPEEL-', '')]) {
      expect(await verifyKey(publicKey, junk)).toBe(false);
    }
  });

  it('rejects every key when no public key is set', async () => {
    expect(await verifyKey('', key)).toBe(false);
  });
});
