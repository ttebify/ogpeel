import { signKey } from '@ogpeel/license';
import { createCheckout, verifyWebhook } from '@/bachs';
import { sendKeyEmail } from '@/email';

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

type CollectionSucceeded = {
  id: string;
  type: string;
  data: {
    charge_id: string | null;
    checkout_id: string | null;
    product_cart: { product_id: string }[] | null;
    customer: { email?: string };
  };
};

/** GET /buy: sends the buyer to a new Bachs checkout for the unlimited-prompts product. */
async function buy(env: Env): Promise<Response> {
  if (!env.BACHS_PRODUCT_ID) return new Response('Not on sale yet.', { status: 503 });
  const url = await createCheckout(env.BACHS_API_URL, env.BACHS_SECRET_KEY, env.BACHS_PRODUCT_ID, env.SUCCESS_URL);
  return Response.redirect(url, 303);
}

/**
 * POST /webhook: when Bachs reports a payment for the product, signs a key and emails it.
 * Nothing is stored. An error answers 500, so Bachs delivers the event again later.
 */
async function webhook(request: Request, env: Env): Promise<Response> {
  const body = await request.text();
  if (!(await verifyWebhook(env.BACHS_WEBHOOK_SECRET, request.headers.get('X-Bachs-Signature-V2'), body))) {
    return new Response('Invalid signature', { status: 400 });
  }
  const event = JSON.parse(body) as CollectionSucceeded;
  if (event.type !== 'collection.succeeded') return new Response('Ignored');
  if (!env.BACHS_PRODUCT_ID || !event.data.product_cart?.some((item) => item.product_id === env.BACHS_PRODUCT_ID)) return new Response('Ignored');

  const paymentId = event.data.charge_id ?? event.data.checkout_id ?? event.id;
  const email = event.data.customer.email;
  if (!email) {
    // Nobody to send to. Make the key by hand: pnpm --filter @ogpeel/worker make-key <payment id>
    console.error('Paid without an email address:', paymentId);
    return new Response('No email');
  }
  const key = await signKey(env.LICENSE_PRIVATE_KEY, paymentId);
  await sendKeyEmail(env.RESEND_API_KEY, env.MAIL_FROM, email, key, 'ogpeel-key-' + paymentId);
  return new Response('Sent');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (request.method === 'GET' && pathname === '/buy') return buy(env);
    if (request.method === 'POST' && pathname === '/webhook') return webhook(request, env);
    return new Response('Not found', { status: 404 });
  },
};
