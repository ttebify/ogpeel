import { generateKeys, verifyKey } from '@ogpeel/license';
import { afterEach, describe, expect, it, vi } from 'vitest';
import worker, { type Env } from '@/index';

const { publicKey, privateKey } = await generateKeys();
const env: Env = {
  BACHS_API_URL: 'https://sandbox-api.bachs.io',
  BACHS_PRODUCT_ID: 'prod_unlimited',
  SUCCESS_URL: 'https://ogpeel.com/thanks',
  MAIL_FROM: 'Ogpeel <hello@ogpeel.com>',
  BACHS_SECRET_KEY: 'sk_sandbox_test',
  BACHS_WEBHOOK_SECRET: 'whsec_test',
  LICENSE_PRIVATE_KEY: privateKey,
  RESEND_API_KEY: 're_test',
};

// The collection.succeeded example from the Bachs docs, with our product in the cart.
const paid = (
  productId = 'prod_unlimited',
  customer: object = { id: 'cust_xyz789', email: 'jane@example.com', name: 'Jane Doe' },
) => ({
  id: 'evt_3ab4e0d5d27445cf8a52ab3d8cb8f0b1',
  type: 'collection.succeeded',
  created_at: '2026-09-22T10:41:18.402Z',
  organization_id: 'acct_7KpQ2mNv4XbR9dLc',
  data: {
    charge_id: 'ch_1a2b3c4d5e6f',
    checkout_id: 'chk_6R7s8T9u0V1w2X3y',
    status: 'SUCCEEDED',
    amount: '9.00',
    currency: 'USD',
    product_cart: [{ product_id: productId, quantity: 1 }],
    customer,
    metadata: {},
  },
});

async function sign(body: string, secret: string, timestamp: number): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(timestamp + '.' + body)),
  );
  return [...digest].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function deliver(event: object, { secret = 'whsec_test', age = 0 } = {}): Promise<Response> {
  const body = JSON.stringify(event);
  const timestamp = Math.floor(Date.now() / 1000) - age;
  const header = `t=${timestamp},v1=${await sign(body, 'whsec_rotated_out', timestamp)},v1=${await sign(body, secret, timestamp)}`;
  return worker.fetch(
    new Request('https://worker.test/webhook', {
      method: 'POST',
      headers: { 'X-Bachs-Signature-V2': header },
      body,
    }),
    env,
  );
}

/** Stands in for Resend and Bachs; returns the requests the worker made. */
function stubFetch(response: () => Response) {
  const calls: { url: string; headers: Headers; body: any }[] = [];
  vi.stubGlobal('fetch', async (url: string, init: RequestInit) => {
    calls.push({ url, headers: new Headers(init.headers), body: JSON.parse(init.body as string) });
    return response();
  });
  return calls;
}

afterEach(() => vi.unstubAllGlobals());

describe('POST /webhook', () => {
  it('emails a working key to the buyer when the product is paid for', async () => {
    const calls = stubFetch(() => Response.json({ id: 'email_1' }));
    const res = await deliver(paid());

    expect(res.status).toBe(200);
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe('https://api.resend.com/emails');
    expect(calls[0].headers.get('Authorization')).toBe('Bearer re_test');
    expect(calls[0].headers.get('Idempotency-Key')).toBe('ogpeel-key-ch_1a2b3c4d5e6f');
    expect(calls[0].body).toMatchObject({
      from: 'Ogpeel <hello@ogpeel.com>',
      to: 'jane@example.com',
      subject: 'Your Ogpeel key',
    });
    const key = calls[0].body.text.match(/OGPEEL-\S+/)[0];
    expect(await verifyKey(publicKey, key)).toBe(true);
  });

  it('sends the same key when Bachs delivers the payment again', async () => {
    const calls = stubFetch(() => Response.json({ id: 'email_1' }));
    await deliver(paid());
    await deliver(paid());
    expect(calls[1].body.text).toBe(calls[0].body.text);
  });

  it('rejects a delivery signed with the wrong secret', async () => {
    const calls = stubFetch(() => Response.json({}));
    expect((await deliver(paid(), { secret: 'whsec_wrong' })).status).toBe(400);
    expect(calls).toHaveLength(0);
  });

  it('rejects a delivery older than five minutes', async () => {
    const calls = stubFetch(() => Response.json({}));
    expect((await deliver(paid(), { age: 301 })).status).toBe(400);
    expect(calls).toHaveLength(0);
  });

  it('rejects a delivery with no signature', async () => {
    const res = await worker.fetch(
      new Request('https://worker.test/webhook', { method: 'POST', body: JSON.stringify(paid()) }),
      env,
    );
    expect(res.status).toBe(400);
  });

  it('sends no key for another product or another event', async () => {
    const calls = stubFetch(() => Response.json({}));
    expect((await deliver(paid('prod_coffee'))).status).toBe(200);
    expect((await deliver({ ...paid(), type: 'refund.paid' })).status).toBe(200);
    expect(calls).toHaveLength(0);
  });

  it('sends no key while no product is set', async () => {
    const calls = stubFetch(() => Response.json({}));
    const body = JSON.stringify(paid(''));
    const timestamp = Math.floor(Date.now() / 1000);
    const header = `t=${timestamp},v1=${await sign(body, 'whsec_test', timestamp)}`;
    const request = new Request('https://worker.test/webhook', {
      method: 'POST',
      headers: { 'X-Bachs-Signature-V2': header },
      body,
    });
    expect((await worker.fetch(request, { ...env, BACHS_PRODUCT_ID: '' })).status).toBe(200);
    expect(calls).toHaveLength(0);
  });

  it('accepts a payment with no email address without sending anything', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const calls = stubFetch(() => Response.json({}));
    expect((await deliver(paid('prod_unlimited', { id: null }))).status).toBe(200);
    expect(calls).toHaveLength(0);
    expect(console.error).toHaveBeenCalledWith('Paid without an email address:', 'ch_1a2b3c4d5e6f');
  });

  it('fails when the email is not accepted, so Bachs tries again', async () => {
    stubFetch(() => new Response('down', { status: 500 }));
    await expect(deliver(paid())).rejects.toThrow('Resend failed: 500');
  });
});

describe('GET /buy', () => {
  it('creates a checkout for the product and sends the buyer to it', async () => {
    const calls = stubFetch(() =>
      Response.json(
        { checkout_id: 'chk_1', checkout_url: 'https://checkout.bachs.io/c/Tb5rHn8YkQ2vXpL' },
        { status: 201 },
      ),
    );
    const res = await worker.fetch(new Request('https://worker.test/buy'), env);

    expect(res.status).toBe(303);
    expect(res.headers.get('Location')).toBe('https://checkout.bachs.io/c/Tb5rHn8YkQ2vXpL');
    expect(calls[0].url).toBe('https://sandbox-api.bachs.io/v1/checkout-sessions');
    expect(calls[0].headers.get('Authorization')).toBe('Bearer sk_sandbox_test');
    expect(calls[0].body).toEqual({
      product_cart: [{ product_id: 'prod_unlimited' }],
      success_url: 'https://ogpeel.com/thanks',
    });
  });

  it('says so when there is no product yet', async () => {
    const res = await worker.fetch(new Request('https://worker.test/buy'), {
      ...env,
      BACHS_PRODUCT_ID: '',
    });
    expect(res.status).toBe(503);
  });
});

it('answers 404 to anything else', async () => {
  expect((await worker.fetch(new Request('https://worker.test/'), env)).status).toBe(404);
  expect((await worker.fetch(new Request('https://worker.test/webhook'), env)).status).toBe(404);
});
