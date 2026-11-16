import { defineConfig } from '@playwright/test';

// Runs against the built static site, so tests see exactly what ships.
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    browserName: 'chromium',
    baseURL: 'http://localhost:4329',
    colorScheme: 'light',
    reducedMotion: 'reduce',
    // A real 2x display at 1280 wide, like the design previews. Playwright's emulated
    // deviceScaleFactor makes Chrome snap the 1.5px rules to 1px, so the viewport is left
    // to the browser and the scale is forced at launch instead.
    viewport: null,
    launchOptions: {
      args: ['--force-device-scale-factor=2', '--window-size=1280,800', '--hide-scrollbars'],
    },
  },
  webServer: {
    command: 'pnpm build && astro preview --port 4329 --ignore-lock',
    url: 'http://localhost:4329',
    reuseExistingServer: !process.env.CI,
  },
});
