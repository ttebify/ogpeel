import { describe, expect, it, vi } from 'vitest';
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

  it('rejects the test key in a store build', async () => {
    vi.stubEnv('DEV', false);
    try {
      expect(await activateKey('OGPEEL-TEST-TEST-TEST')).toBe(false);
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
