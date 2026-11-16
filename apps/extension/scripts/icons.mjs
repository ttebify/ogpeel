// Renders the extension icons into public/icon/. Run: node scripts/icons.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const big = (sw, aw) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 112"><rect x="1" y="1" width="110" height="110" fill="#1A1714"/><rect x="22" y="26" width="68" height="44" fill="none" stroke="#EFE6D8" stroke-width="${sw}"/><path d="M56 48v40M42 74l14 14 14-14" fill="none" stroke="#C8401E" stroke-width="${aw}" stroke-linecap="square"/></svg>`;

const icons = {
  128: big(4, 7),
  48: big(6, 9),
  32: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 112"><rect width="112" height="112" fill="#1A1714"/><rect x="20" y="24" width="72" height="46" fill="none" stroke="#EFE6D8" stroke-width="9"/><path d="M56 46v42M40 72l16 16 16-16" fill="none" stroke="#E2593A" stroke-width="12" stroke-linecap="square"/></svg>`,
  16: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="#1A1714"/><path d="M8 3v9M4.5 8.5L8 12l3.5-3.5" fill="none" stroke="#E2593A" stroke-width="2" stroke-linecap="square"/></svg>`,
};

const dir = fileURLToPath(new URL('../public/icon/', import.meta.url));
await mkdir(dir, { recursive: true });
for (const [size, svg] of Object.entries(icons)) {
  const n = Number(size);
  const viewBox = Number(svg.match(/viewBox="0 0 (\d+)/)[1]);
  // Rasterise at 4x the target, then downsample, so edges stay crisp.
  const density = Math.ceil((72 * n * 4) / viewBox);
  await sharp(Buffer.from(svg), { density }).resize(n, n).png().toFile(`${dir}${n}.png`);
  console.log(`public/icon/${n}.png`);
}
