// Each page, rendered like the design's preview (1280 wide, 2x display), is compared pixel by pixel
// with its PNG in design/site/. The page must have the design's exact height, and almost every
// pixel must match. Diff images land in test-results/ for a failing page.
import { expect, test } from '@playwright/test';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const design = (name: string) =>
  fileURLToPath(new URL(`../../../design/site/${name}.png`, import.meta.url));

/** Share of pixels allowed to differ: a few dozen anti-aliased glyph edges, nothing a layout change could hide in. */
const MAX_DIFF = 0.0005;

const pages = [
  { name: 'landing', path: '/' },
  { name: 'privacy', path: '/privacy/' },
  { name: 'restore', path: '/key/' },
  { name: 'thanks', path: '/thanks/' },
];

for (const { name, path } of pages) {
  test(`${name} matches design/site/${name}.png`, async ({ page }, info) => {
    const want = PNG.sync.read(readFileSync(design(name)));
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const got = PNG.sync.read(
      await page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide' }),
    );

    expect({ width: got.width, height: got.height }, 'page size').toEqual({
      width: want.width,
      height: want.height,
    });

    const diff = new PNG({ width: want.width, height: want.height });
    const changed = pixelmatch(got.data, want.data, diff.data, want.width, want.height, {
      threshold: 0.2,
    });
    const share = changed / (want.width * want.height);
    if (share > MAX_DIFF) {
      const dir = info.outputPath();
      mkdirSync(dir, { recursive: true });
      writeFileSync(`${dir}/${name}-actual.png`, PNG.sync.write(got));
      writeFileSync(`${dir}/${name}-diff.png`, PNG.sync.write(diff));
    }
    expect(share, `${(share * 100).toFixed(2)}% of pixels differ`).toBeLessThanOrEqual(MAX_DIFF);
  });
}
