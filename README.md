# Ogpeel

A browser extension that saves the image a page shows when it is shared (its `og:image` or `twitter:image`), at full size, named after the page.

- Save the share image in one click, or copy the image or its link.
- See every share image a page sets, not just the first.
- Preview how the link looks on X, LinkedIn, Slack and WhatsApp, with plain checks on size, title, description and alt text.
- Get a prompt for your coding agent to build share images for your own site in the same style, for 19 frameworks, including Next.js, Nuxt, SvelteKit, Astro, Hugo, WordPress, Laravel, Django, Rails and Shopify.

## Privacy

Ogpeel reads a page only when you click its icon, through the `activeTab` permission. Nothing is sent anywhere. It asks for access to one image host only when Copy image needs it to read that image.

## Develop

```sh
pnpm install
pnpm dev          # opens Edge with the extension loaded
pnpm dev:chrome   # same, in Chrome
pnpm build        # load apps/extension/.output/chrome-mv3 as an unpacked extension
pnpm test         # unit tests (vitest)
pnpm icons        # regenerate apps/extension/public/icon/*.png
pnpm typecheck    # check all implemented workspaces
pnpm build:e2e
pnpm smoke        # browser check; screenshots in apps/extension/.output/smoke/
```

## Layout

This repository uses pnpm workspaces. Root commands run the extension or, for build, test and typecheck, every workspace that defines the corresponding script. Run a specific app with `pnpm --filter @ogpeel/extension <command>` (or `@ogpeel/worker`, `@ogpeel/frontend`).

- `apps/extension/` the working browser extension: `entrypoints/popup/` for UI, `lib/` for logic, `tests/` for unit tests, `scripts/` for icons and browser smoke checks
- `apps/worker/` a Cloudflare Worker that starts the Bachs checkout and emails a signed key after payment; see its README
- `apps/frontend/` ogpeel.com, a static Astro site, tested pixel by pixel against the designs; see its README
- `packages/license/` the key format shared by the worker (signs) and the extension (verifies)
- `packages/pricing/` the price, the coffee and the refund window, quoted by the popup, the site and the key email
- `packages/theme/` the paper look shared by the popup and the site: colours, fonts and theme tokens. Components are not shared; each app keeps its own
- `design/` shared designs, grouped into `extension/`, `store/` and `site/`; each is a source file (`.dc.html`) with a PNG of the same name

## Payment

Ogpeel is free. Developer prompts are free twice; after that a one-time licence key unlocks them. Payment goes through Bachs; a small worker (`apps/worker/`) then emails a signed key. The extension checks the key on the device and sends nothing. In a development build, the key `OGPEEL-TEST-TEST-TEST` unlocks.

## Licence

MIT, see [LICENSE](LICENSE). The name "Ogpeel" and its logo are not covered by the licence; if you publish a fork, use another name and logo.

Coding agents: see `AGENTS.md`.
