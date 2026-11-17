import { defineConfig } from 'wxt';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';

// OGPEEL_E2E=1 adds broad host access so an automated test can open the popup
// as a normal page and still read another tab. Never set it for a store build.
const e2e = process.env.OGPEEL_E2E === '1';

export default defineConfig({
  manifest: {
    name: 'Ogpeel',
    description: 'Save the image in a link preview, full size, in one click.',
    permissions: ['activeTab', 'scripting', 'downloads', 'storage', 'clipboardWrite'],
    host_permissions: e2e ? ['<all_urls>'] : [],
    // Asked for one image host at a time, only when Copy image needs it.
    optional_host_permissions: ['*://*/*'],
    action: { default_title: 'Ogpeel' },
  },
  vite: () => ({ plugins: [preact(), tailwindcss()] }),
  webExt: {
    binaries: { edge: '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge' },
    startUrls: ['https://linear.app/now/behind-the-latest-design-refresh'],
  },
});
