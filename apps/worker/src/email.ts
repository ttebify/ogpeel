import { REFUND_DAYS } from '@ogpeel/pricing';

/**
 * Emails a key through Resend. The idempotency key stops a second email when
 * Bachs delivers the same payment twice. Throws when the email was not accepted.
 */
export async function sendKeyEmail(apiKey: string, from: string, to: string, licenseKey: string, idempotencyKey: string): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify({
      from,
      to,
      subject: 'Your Ogpeel key',
      text: [
        "Thank you for paying for Ogpeel. Here's your key for unlimited developer prompts.",
        licenseKey,
        'In Ogpeel, open “Make one like this for your site”, choose “I have a key” and paste it. It works on every browser you use.',
        `Changed your mind? Reply within ${REFUND_DAYS} days and you'll get every cent back.`,
        '— Justice, who made Ogpeel\nogpeel.com',
      ].join('\n\n'),
    }),
  });
  if (!res.ok) throw new Error('Resend failed: ' + res.status);
}
