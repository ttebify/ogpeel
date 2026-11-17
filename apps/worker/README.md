# Ogpeel worker

Takes payment and emails the key. A Cloudflare Worker with two routes; it stores nothing, and the extension never contacts it.

- `GET /buy` creates a [Bachs](https://docs.bachs.io) checkout for the unlimited-prompts product and sends the buyer to it. The site's pay button links here.
- `POST /webhook` receives Bachs events. On `collection.succeeded` for that product it signs a key (`@ogpeel/license`) and emails it to the buyer through [Resend](https://resend.com/docs). A bad or old signature gets a 400. If the email fails, the worker answers 500 and Bachs sends the event again.

One payment always makes the same key, so a repeated event sends the same key again.

Lost keys are answered by hand, since nothing is stored. ogpeel.com/key asks the buyer to email; find their payment in Bachs, run `pnpm make-key <payment id>` and send the key it prints.

## Settings

In `wrangler.jsonc`: `BACHS_API_URL` (sandbox or live), `BACHS_PRODUCT_ID`, `SUCCESS_URL`, `MAIL_FROM`.

Secrets, in `.dev.vars` for `pnpm dev` and `wrangler secret put <NAME>` for the deployed worker:

| Name                   | Where it comes from                                              |
| ---------------------- | ---------------------------------------------------------------- |
| `BACHS_SECRET_KEY`     | Bachs developer portal, API keys (`sk_sandbox_…` or `sk_live_…`) |
| `BACHS_WEBHOOK_SECRET` | The signing secret of the webhook endpoint (`whsec_…`)           |
| `RESEND_API_KEY`       | Resend                                                           |
| `LICENSE_PRIVATE_KEY`  | `pnpm keygen`, which saves it to `.dev.vars`                     |

`pnpm keygen` also prints the public key, which goes in `apps/extension/lib/config.ts`. Run it once. A new pair stops every key already sold from working, so keep a copy of the private key somewhere safe, outside the repository.

## Commands

Run from this folder, or from the root with `pnpm --filter @ogpeel/worker <command>`.

| Command                      | What it does                                    |
| ---------------------------- | ----------------------------------------------- |
| `pnpm dev`                   | Runs the worker locally                         |
| `pnpm test`                  | Unit tests for both routes                      |
| `pnpm build`                 | Bundles without deploying                       |
| `pnpm deploy`                | Deploys to Cloudflare                           |
| `pnpm make-key <payment id>` | Prints the key for one payment, to send by hand |

## Deploying

1. Create the product in Bachs and put its id in `BACHS_PRODUCT_ID`.
2. Verify the sending domain in Resend and set `MAIL_FROM` to an address on it.
3. Set the four secrets and deploy.
4. In Bachs, add a webhook endpoint for `https://<worker address>/webhook` with the `collection.succeeded` event, and save its signing secret as `BACHS_WEBHOOK_SECRET`.
5. Pay once in the sandbox and check that the key arrives and unlocks the extension.
6. Switch `BACHS_API_URL` to `https://api.bachs.io` and the secret key to the live one.
