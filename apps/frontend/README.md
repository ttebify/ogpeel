# Ogpeel website

ogpeel.com, a static Astro site. Its designs are in `design/site/`.

| Page       | What it's for                                       |
| ---------- | --------------------------------------------------- |
| `/`        | The landing page                                    |
| `/privacy` | The privacy policy                                  |
| `/key`     | Where to find your key, and who to write to if lost |
| `/thanks`  | After paying. Shows no key; the key is only emailed |

| Command          | What it does                                                     |
| ---------------- | ---------------------------------------------------------------- |
| `pnpm dev`       | Local server                                                     |
| `pnpm build`     | Builds the site into `dist/`                                     |
| `pnpm typecheck` | Runs `astro check`                                               |
| `pnpm test`      | Builds the site and checks accessibility, keyboard use and links |

Colours and fonts come from `@ogpeel/theme`, prices from `@ogpeel/pricing`. Links that change at launch are in `src/config.ts`.

`cookie` is listed as a dependency though nothing imports it. Without it, `astro build` picks up an older copy and fails with `Named export 'parseCookie' not found`.
