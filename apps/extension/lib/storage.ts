import { browser } from 'wxt/browser';
import { FREE_PROMPTS } from './config';
import type { Framework, License, Settings } from './types';

export const DEFAULT_SETTINGS: Settings = { naming: 'title', look: 'auto', keepSource: true };
export const DEFAULT_LICENSE: License = { unlocked: false, freeLeft: FREE_PROMPTS };

export async function loadPrefs(): Promise<{
  settings: Settings;
  license: License;
  framework?: Framework;
}> {
  const got = await browser.storage.local.get(['settings', 'license', 'framework']);
  return {
    settings: { ...DEFAULT_SETTINGS, ...((got.settings as Partial<Settings>) || {}) },
    license: { ...DEFAULT_LICENSE, ...((got.license as Partial<License>) || {}) },
    framework: (got.framework as Framework | undefined) || undefined,
  };
}
export const saveSettings = (settings: Settings) => browser.storage.local.set({ settings });
export const saveFramework = (framework: Framework) => browser.storage.local.set({ framework });
export const saveLicense = (license: License) => browser.storage.local.set({ license });
