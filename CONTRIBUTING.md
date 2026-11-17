# Contributing

Issues and pull requests are welcome. You need Node 24 and pnpm.

```sh
pnpm install
pnpm dev          # Edge with the extension loaded (pnpm dev:chrome for Chrome)
```

## Before you open a pull request

```sh
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

If you changed something in the popup, also run `pnpm build:e2e && pnpm smoke` and look at the screenshots in `apps/extension/.output/smoke/`.

## Rules

- Keep it private. No new permissions, nothing that runs before the icon is clicked, and no network requests except loading the page's image. No analytics.
- A change to `lib/read-page.ts` needs a test.
- A change to the website starts in its design in `design/site/`.
- The prices and the refund window are not open for change.

All the rules are in [AGENTS.md](AGENTS.md). Report security problems as [SECURITY.md](SECURITY.md) says, not in a public issue.
