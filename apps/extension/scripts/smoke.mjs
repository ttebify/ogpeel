// Loads the e2e build in a real browser, opens a page, opens the popup against that
// tab and saves screenshots to .output/smoke/. Run: pnpm build:e2e && node scripts/smoke.mjs [url]
import { chromium } from 'playwright-core';
import { createHash } from 'node:crypto';
import { mkdirSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';

const url = process.argv[2] || 'https://linear.app/now/behind-the-latest-design-refresh';
const ext = resolve('.output/chrome-mv3-dev');
if (!existsSync(ext)) throw new Error('Run `pnpm build:e2e` first: ' + ext + ' is missing');
const out = resolve('.output/smoke');
mkdirSync(out, { recursive: true });

// Chromium derives an unpacked extension's id from its folder path.
const id = [...createHash('sha256').update(ext).digest('hex').slice(0, 32)]
  .map((c) => String.fromCharCode(97 + parseInt(c, 16)))
  .join('');
const edge = '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge';
const profile = resolve(tmpdir(), 'ogpeel-smoke-profile');
rmSync(profile, { recursive: true, force: true });

const ctx = await chromium.launchPersistentContext(profile, {
  headless: false,
  ...(process.env.SMOKE_BUNDLED ? {} : { executablePath: process.env.SMOKE_BROWSER || edge }),
  args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, '--no-first-run'],
  viewport: { width: 1280, height: 800 },
});
const fail = async (msg) => {
  console.error('FAIL: ' + msg);
  await ctx.close();
  process.exit(1);
};
try {
  const page = ctx.pages()[0] || (await ctx.newPage());
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const popup = await ctx.newPage();
  await popup.setViewportSize({ width: 360, height: 600 });
  await popup
    .goto(`chrome-extension://${id}/popup.html`)
    .catch((e) => fail('extension did not load (' + e.message.split('\n')[0] + ')'));
  const tabId = await popup.evaluate(
    async (u) =>
      (await chrome.tabs.query({})).find((t) => t.url && t.url.startsWith(u.split('#')[0]))?.id,
    url,
  );
  if (tabId === undefined) await fail('could not find the page tab');
  await popup.goto(`chrome-extension://${id}/popup.html?tabId=${tabId}`);
  await popup.waitForFunction(() => !document.body.innerText.includes('READING THE PAGE'), null, {
    timeout: 20000,
  });
  await popup.waitForTimeout(800);
  const shot = async (name) => {
    await popup.screenshot({ path: `${out}/${name}.png` });
    console.log('shot', name);
  };
  await shot('01-popup');
  console.log('TEXT:', (await popup.innerText('body')).replace(/\s+/g, ' ').slice(0, 400));
  const click = async (re) => {
    await popup.getByRole('button', { name: re }).first().click();
    await popup.waitForTimeout(500);
  };
  for (const [name, open, back] of [
    ['07-preview', /when shared/i, /back/i],
    ['08-dev', /make one like this/i, /back/i],
    ['12-settings', /settings/i, /back/i],
  ]) {
    try {
      await click(open);
      await shot(name);
      await click(back);
    } catch (e) {
      console.error('WARN', name, e.message.split('\n')[0]);
    }
  }
  try {
    await click(/settings/i);
    await click(/^night$/i);
    await click(/back/i);
    await shot('01-popup-night');
    await click(/settings/i);
    await click(/^auto$/i);
    await click(/back/i);
  } catch (e) {
    console.error('WARN night', e.message.split('\n')[0]);
  }
  try {
    await click(/download image/i);
    await popup.waitForFunction(() => /saved/i.test(document.body.innerText), null, {
      timeout: 20000,
    });
    await shot('03-saved');
    console.log('SAVED TEXT:', (await popup.innerText('body')).replace(/\s+/g, ' ').slice(0, 300));
  } catch (e) {
    console.error('WARN download', e.message.split('\n')[0]);
  }
  console.log('OK');
} finally {
  await ctx.close();
}
