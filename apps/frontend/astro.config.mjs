import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ogpeel.com',
  output: 'static',
  // Builds /privacy and /key as folders, so the URLs the extension opens (lib/config.ts) resolve.
  build: { format: 'directory' },
  integrations: [preact()],
  vite: { plugins: [tailwindcss()] },
});
