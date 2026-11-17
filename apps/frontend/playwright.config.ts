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
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: 'pnpm build && astro preview --port 4329 --ignore-lock',
    url: 'http://localhost:4329',
    reuseExistingServer: !process.env.CI,
  },
});
