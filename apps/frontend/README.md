# Ogpeel frontend

ogpeel.com as a static Astro site. Pages: `/` (landing), `/privacy`, `/key` (where a key is, and who to write to if it is lost), `/thanks` (after paying; the key itself is only emailed). Designs: `../../design/site/`.

| Command | What it does |
|---|---|
| `pnpm dev` | Local dev server |
| `pnpm build` | Static site in `dist/` |
| `pnpm typecheck` | `astro check` (needs TypeScript 6, pinned here) |
| `pnpm test` | Builds, serves, and runs Playwright: pixel comparison with the design PNGs, axe, keyboard flows |

The paper look (colours, fonts, theme tokens) comes from `@ogpeel/theme`, shared with the extension. The site's own buttons are in `src/components/button-variants.ts`, its own sizes in `src/styles/site.css`, and the links that change at launch in `src/config.ts`. Prices come from `@ogpeel/pricing`.

`cookie` is a direct dependency although no file here imports it: without it, `astro build` resolves an older copy from the workspace root and fails with `Named export 'parseCookie' not found`.

`tests/design.spec.ts` renders each page on a real 2x display at 1280 wide and requires the exact design height and at most 0.05% differing pixels. Diffs for a failing page land in `test-results/`. It uses Chrome's forced device scale, not Playwright's emulated one, because emulation makes Chrome draw the 1.5px rules at 1px.
