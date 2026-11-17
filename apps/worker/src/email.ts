import { REFUND_DAYS } from '@ogpeel/pricing';
import type { Env } from '@/env';

export type Payment = {
  id: string;
  amount: string;
  currency: string;
  paidAt: string;
};

const THANKS = "Thank you for paying for Ogpeel. Here's your key for unlimited developer prompts.";
const HOW =
  'In Ogpeel, open “Make one like this for your site”, choose “I have a key” and paste it. It works on every browser you use.';
const REFUND = `Changed your mind? Reply within ${REFUND_DAYS} days and you'll get every cent back.`;
const SIGNED = '— Justice, who made Ogpeel';

const INK = '#1A1714';
const SERIF = 'font-family: Newsreader, Georgia, serif';
const MONO = "font-family: 'IBM Plex Mono', Menlo, Consolas, monospace";
const BODY = `font-size: 17px; line-height: 1.5; ${SERIF}`;
const CELL = `padding: 10px 0; border-top: 1.5px solid ${INK}; ${MONO}; font-size: 13px`;
const LINK = 'color: #5E554B; text-decoration: none';

function html(licenseKey: string, total: string, date: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Your Ogpeel key</title>
</head>
<body style="margin: 0; padding: 0; background: #EFE6D8">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #EFE6D8"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; color: ${INK}"><tr><td style="padding: 40px; text-align: left">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-bottom: 4px double ${INK}"><tr>
    <td style="padding-bottom: 8px; ${SERIF}; font-size: 32px; font-weight: 600">Ogpeel<span style="color: #C8401E">.</span></td>
    <td align="right" valign="bottom" style="padding-bottom: 14px; ${MONO}; font-size: 12px">RECEIPT · ${date}</td>
  </tr></table>
  <p style="margin: 32px 0 0; font-size: 24px; line-height: 1.3; ${SERIF}">${THANKS}</p>
  <div style="margin-top: 24px; padding: 20px; border: 1.5px solid ${INK}; background: #F7F1E6; ${MONO}; font-size: 16px; line-height: 1.5; letter-spacing: 1px; text-align: center; word-break: break-all">${licenseKey}</div>
  <p style="margin: 16px 0 0; ${BODY}">${HOW}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px">
    <tr><td style="${CELL}">Ogpeel · unlimited prompts</td><td align="right" style="${CELL}">${total}</td></tr>
    <tr><td style="${CELL}; border-bottom: 1.5px solid ${INK}; font-weight: 500">Paid</td><td align="right" style="${CELL}; border-bottom: 1.5px solid ${INK}; font-weight: 500">${total}</td></tr>
  </table>
  <p style="margin: 24px 0 0; ${BODY}">${REFUND}</p>
  <p style="margin: 16px 0 0; font-size: 17px; font-style: italic; ${SERIF}">${SIGNED}</p>
  <div style="margin-top: 64px; padding-top: 16px; border-top: 1.5px solid ${INK}; ${MONO}; font-size: 12px; color: #5E554B; line-height: 1.6">Checkout by Bachs.<br><a href="https://ogpeel.com" style="${LINK}">ogpeel.com</a> · <a href="https://ogpeel.com/privacy" style="${LINK}">Privacy</a> · <a href="https://ogpeel.com/key" style="${LINK}">Find my key</a></div>
</td></tr></table>
</td></tr></table>
</body>
</html>`;
}

export async function sendKeyEmail(
  env: Env,
  to: string,
  licenseKey: string,
  payment: Payment,
): Promise<void> {
  const total = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: payment.currency,
  }).format(Number(payment.amount));
  const date = new Date(payment.paidAt).toUTCString().slice(5, 16).toUpperCase();

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + env.RESEND_API_KEY,
      'Content-Type': 'application/json',
      'Idempotency-Key': 'ogpeel-key-' + payment.id,
    },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to,
      subject: 'Your Ogpeel key',
      html: html(licenseKey, total, date),
      text: [
        THANKS,
        licenseKey,
        HOW,
        `Ogpeel · unlimited prompts: ${total}\nPaid: ${total}`,
        REFUND,
        SIGNED + '\nogpeel.com',
      ].join('\n\n'),
    }),
  });
  if (!res.ok) throw new Error('Resend failed: ' + res.status);
}
