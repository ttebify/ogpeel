import { browser } from 'wxt/browser';
import { FREE_PROMPTS } from './config';
import type { License, Settings } from './types';

export const DEFAULT_SETTINGS: Settings = { naming: 'title', look: 'auto', keepSource: true };
export const DEFAULT_LICENSE: License = { unlocked: false, freeLeft: FREE_PROMPTS };

export async function loadPrefs(): Promise<{ settings: Settings; license: License }> {
  const got = await browser.storage.local.get(['settings', 'license']);
  return {
    settings: { ...DEFAULT_SETTINGS, ...((got.settings as Partial<Settings>) || {}) },
    license: { ...DEFAULT_LICENSE, ...((got.license as Partial<License>) || {}) },
  };
}
export const saveSettings = (settings: Settings) => browser.storage.local.set({ settings });
export const saveLicense = (license: License) => browser.storage.local.set({ license });
