import { describe, expect, it } from 'vitest';
import { activateKey } from '@/lib/license';

describe('activateKey', () => {
  it('rejects an empty or made-up key without asking anyone', async () => {
    expect(await activateKey('   ')).toBe(false);
    expect(await activateKey('OGPEEL-7Q2K-M4XD-91RB')).toBe(false);
  });

  it('accepts the test key in a development build', async () => {
    expect(import.meta.env.DEV).toBe(true);
    expect(await activateKey(' ogpeel-test-test-test ')).toBe(true);
  });
});
