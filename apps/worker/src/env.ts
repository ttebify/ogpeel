/** Settings from wrangler.jsonc, and secrets from .dev.vars or Wrangler secrets. */
export type Env = {
  BACHS_API_URL: string;
  BACHS_PRODUCT_ID: string;
  SUCCESS_URL: string;
  MAIL_FROM: string;
  BACHS_SECRET_KEY: string;
  BACHS_WEBHOOK_SECRET: string;
  LICENSE_PRIVATE_KEY: string;
  RESEND_API_KEY: string;
};
