# Ogpeel

A browser extension that saves the image a page shows when someone shares its link (`og:image` or `twitter:image`). Full size, named after the page.

- Save the image in one click, or copy the image or its link.
- See every share image the page sets, not just the first.
- Preview the link on X, LinkedIn, Slack and WhatsApp, with checks on size, title, description and alt text.
- Get a prompt your coding agent can use to build share images for your own site. Covers 19 frameworks, from Next.js and Astro to WordPress and Rails.

## Privacy

Ogpeel reads a page only when you click its icon. It sends nothing anywhere. It asks for access to an image's host only when you use Copy image, one host at a time.

## Run it

```sh
pnpm install
pnpm dev          # Edge with the extension loaded (pnpm dev:chrome for Chrome)
pnpm test
pnpm build        # then load apps/extension/.output/chrome-mv3 as an unpacked extension
```

More commands are in [CONTRIBUTING.md](CONTRIBUTING.md).

## What's where

- `apps/extension/` the extension
- `apps/frontend/` the website, ogpeel.com
- `apps/worker/` takes payment and emails the key
- `packages/` code more than one app needs: the key format, the prices and the look
- `design/` the designs for the popup, the store listing and the site

## Paying

Ogpeel is free. Developer prompts are free twice; after that, a one-time key unlocks them. The key is checked on your device and never sent. In a development build, `OGPEEL-TEST-TEST-TEST` works as a key.

## Licence

MIT, see [LICENSE](LICENSE). The name "Ogpeel" and its logo are not covered. If you publish a fork, give it another name and logo.
