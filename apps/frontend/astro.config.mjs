import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ogpeel.com',
  output: 'static',
  // /privacy and /key, the paths the extension opens (lib/config.ts).
  build: { format: 'directory' },
  vite: { plugins: [tailwindcss()] },
});
