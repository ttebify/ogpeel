# Ogpeel

A browser extension that saves the image a page shows when it's shared (og:image / twitter:image). Free and open source; a one-time key unlocks unlimited developer prompts. Site: ogpeel.com.

This file is the single set of instructions for every coding agent. `CLAUDE.md` only points here.

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Opens Edge with the extension loaded and live reload (`pnpm dev:chrome` for Chrome) |
| `pnpm typecheck` | Runs typecheck in each implemented workspace |
| `pnpm test` | Runs tests in each implemented workspace (extension: Vitest, happy-dom) |
| `pnpm build` | Builds implemented workspaces; extension store build in `apps/extension/.output/chrome-mv3` |
| `pnpm build:e2e && pnpm smoke [url]` | Loads the extension in a real browser, clicks through it, saves screenshots to `apps/extension/.output/smoke/` |
| `pnpm icons` | Regenerates `apps/extension/public/icon/*.png` |

A change is done when typecheck, tests and build pass, and for anything visible in the popup, when the smoke run's screenshots look right. Look at the screenshots; don't assume.

## Layout

pnpm workspaces under `apps/`: `extension` is implemented; `worker` (payment webhooks and license delivery) and `frontend` (ogpeel.com) are placeholders. Their frameworks, runtimes and deployments are not selected. Root build, test and typecheck run workspace scripts where defined. Extension commands can also run through `pnpm --filter @ogpeel/extension <command>`.

The extension paths below are relative to `apps/extension/`; `design/` remains at the repository root.

- `entrypoints/popup/app.tsx` – all state and actions. `screens/*.tsx` – one presentational component per screen, `({ s, a }: ScreenProps)`. `style.css` – every style.
- `lib/types.ts` – the contract between logic and screens. Change it first when a screen needs new data.
- `lib/read-page.ts` – runs inside the visited page. `lib/browser-actions.ts` – downloads, clipboard, tabs. `lib/prompt.ts` – the developer prompt. `lib/license.ts` – key check. `lib/config.ts` – prices, URLs, product id.
- `design/` – every design, grouped by where it's used. Each one is a pair with the same name: `name.dc.html` is the source of truth (exact colours, sizes, spacing in inline styles) and `name.png` is how it looks.
  - `design/extension/` – the popup screens, the brand board (`main`) and the icons.
  - `design/store/` – the store screenshots (`shot1`–`shot5`, 1280×800), the small tile (`promo`, 440×280) and the marquee (1400×560). The PNGs are the files to upload.
  - `design/site/` – the website pages, the receipt email and the site's share image. Not built yet.
- `tests/` – unit tests. `scripts/` – icons and the smoke test.

## Project rules

**Privacy is the product.** These are promises made on the store listing and the privacy page.
- Permissions stay `activeTab`, `scripting`, `downloads`, `storage`, `clipboardWrite`. Never add `<all_urls>` or any host permission to the store build. `OGPEEL_E2E=1` adds broad access for the smoke test only.
- Nothing runs until the icon is clicked: no background script, no content script that loads on its own.
- No network requests except the Lemon Squeezy license check and loading the image the page names. No analytics, no error reporting, no remote fonts or code.
- Access to an image's host is asked for one host at a time, only when Copy image needs it.
- If a change would make the privacy page or store listing untrue, stop and ask.

**Code**
- Use kebab-case for project filenames, including component files and design assets. Keep conventional filenames such as `AGENTS.md`, `CLAUDE.md`, `README.md` and `LICENSE`.
- `readPage()` is injected into pages: it must use nothing from outside its own body.
- `lib/read-page.ts`, `lib/util.ts` and `lib/prompt.ts` import nothing from the browser API, so they can be unit tested. Keep it that way.
- Logic goes in `app.tsx` or `lib/`; screens only render `s` and call `a`.
- Import across folders with `@/` (the extension root, e.g. `@/lib/types`); use `./` only for files in the same folder.
- Reading tags correctly is the core. Any change to `read-page.ts` comes with a test case.
- The worker workspace is reserved for the planned server component. This restructuring does not authorize implementing payment or licensing changes; agree on that scope before adding server behavior.

**Design**
- Match the designs in `design/`. Paper look: square corners, 1.5px ink rules, a double rule under headers, depth as a 3px offset ink block, never a soft shadow or a gradient.
- Colours only through the CSS variables in `style.css` (`--ground`, `--sheet`, `--ink`, `--pencil`, `--hot`, `--on-hot`), so the night look keeps working. Vermilion (`--hot`) is for actions that save a file or pay.
- Newsreader for words a person reads, IBM Plex Mono (uppercase) for labels and file facts. Fonts are bundled, never loaded from a CDN.
- The popup is exactly 360 × 600. Long content scrolls inside its own box.
- Real `<button>`s, `aria-label` on icon-only buttons, a visible focus outline. No emoji.
- Screen copy is plain and for users, not developers. No screen explains how a feature works inside. Don't promise in copy what the code doesn't do.

**Not decided, don't change without asking:** the $9 price, the $3 coffee, the 14-day refund, Lemon Squeezy as the provider (`lib/config.ts`). `LEMON_PRODUCT_ID` is 0 until the product exists; the dev-only key `OGPEEL-TEST-TEST-TEST` works in `pnpm dev` and must never work in a store build.

**Git:** commit, push or open a PR only when asked. Never commit `.output`, `.wxt` or `node_modules`.

## Coding principles

These bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think before coding
Don't assume. Don't hide confusion. Surface tradeoffs.
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them; don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.
- When you ask a question, use the interactive ask tool if one is available. Offer concrete options and put your recommended option first. Fall back to plain text only when there is no such tool.

### 2. Simplicity first
Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.
- Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical changes
Touch only what you must. Clean up only your own mess.
- Don't "improve" adjacent code, comments or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it; don't delete it.
- Remove imports, variables and functions that your own change made unused. Leave pre-existing dead code unless asked.
- The test: every changed line traces directly to the request.

### 4. Goal-driven execution
Define success criteria. Loop until verified.
- "Add validation" → write tests for invalid inputs, then make them pass.
- "Fix the bug" → write a test that reproduces it, then make it pass.
- "Refactor X" → tests pass before and after.
- For multi-step tasks, state a brief plan, each step with its check: `1. [step] → verify: [check]`.

### 5. Report honestly
- Say what you verified and how, and what you didn't. "Builds" is not "works".
- If a test fails or a step was skipped, say so with the output.
- Never invent a number, a price, a file size or an API's behaviour. Check it, or mark it as unverified.
- Before deleting or overwriting anything you didn't create in this task, look at it first.
