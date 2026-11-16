// Accessibility and behaviour: axe finds no WCAG A/AA violations, and every interaction
// works from the keyboard.
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const paths = ['/', '/privacy/', '/key/', '/thanks/'];

for (const path of paths) {
  test(`${path} has no axe violations`, async ({ page }) => {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });

  test(`${path} has one h1 and a main landmark`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
  });
}

test('the night band passes axe colour contrast', async ({ page }) => {
  await page.goto('/');
  const { violations } = await new AxeBuilder({ page }).include('[data-look="night"]').withRules(['color-contrast']).analyze();
  expect(violations).toEqual([]);
});

test('skip link is the first tab stop and moves to main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('FAQ opens one answer at a time, by keyboard', async ({ page }) => {
  await page.goto('/');
  const items = page.locator('details[name="faq"]');
  await expect(items).toHaveCount(5);
  await expect(items.nth(0)).toHaveAttribute('open', '');
  const refund = page.locator('summary', { hasText: 'Can I get a refund?' });
  await refund.focus();
  await page.keyboard.press('Enter');
  await expect(items.nth(4)).toHaveAttribute('open', '');
  await expect(items.nth(0)).not.toHaveAttribute('open');
  await expect(page.getByText('Yes, within 14 days.')).toBeVisible();
  await expect(page.getByText('Only the page you click the icon on')).toBeHidden();
});

test('Find my key gives an address to write to, and has no form', async ({ page }) => {
  await page.goto('/key/');
  await expect(page.getByRole('link', { name: 'Email hello@ogpeel.com' })).toHaveAttribute('href', 'mailto:hello@ogpeel.com');
  await expect(page.locator('form, input')).toHaveCount(0);
});

test('thanks says the key is emailed and shows none', async ({ page }) => {
  await page.goto('/thanks/?key=OGPEEL-7Q2K-M4XD-91RB');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Thank you. Your key is on its way.');
  await expect(page.getByText('OGPEEL-')).toHaveCount(0);
});

test('every link on every page resolves', async ({ page, request }) => {
  for (const path of paths) {
    await page.goto(path);
    const hrefs = await page.locator('a[href]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
    for (const href of hrefs) {
      const url = new URL(href);
      if (url.protocol === 'mailto:') continue;
      if (url.hash && url.pathname === new URL(page.url()).pathname) {
        await expect(page.locator(url.hash), `${path} → ${url.hash}`).toHaveCount(1);
      } else {
        expect((await request.get(url.pathname)).status(), `${path} → ${href}`).toBe(200);
      }
    }
  }
});

test('the site makes no request outside its own origin', async ({ page }) => {
  const outside: string[] = [];
  page.on('request', (r) => { if (!r.url().startsWith('http://localhost:4329')) outside.push(r.url()); });
  for (const path of paths) await page.goto(path, { waitUntil: 'networkidle' });
  expect(outside).toEqual([]);
});
