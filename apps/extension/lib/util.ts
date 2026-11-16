import type { Check, OgImage, PageInfo } from './types';

const EXT: Record<string, string> = { jpeg: 'jpg', jpg: 'jpg', png: 'png', webp: 'webp', gif: 'gif', avif: 'avif', svg: 'svg' };
const MIME: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif', 'image/svg+xml': 'svg' };

/** File extension from the URL's path, lower case, or '' when it has none we know. */
export function extOf(url: string): string {
  try {
    const m = new URL(url).pathname.match(/\.([a-z0-9]{3,4})$/i);
    return (m && EXT[m[1]!.toLowerCase()]) || '';
  } catch {
    return '';
  }
}
export const extFromMime = (mime: string | undefined): string => MIME[(mime || '').split(';')[0]!.trim().toLowerCase()] || '';
export const formatOf = (url: string): string | undefined => extOf(url).toUpperCase() || undefined;

export function hostOf(url: string | undefined): string {
  try {
    return new URL(url || '').host.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/** A safe file name stem from a page title: "A calmer interface!" -> "a-calmer-interface". */
export function slug(title: string, fallback = 'share-image'): string {
  const s = title
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');
  return s || fallback;
}

export function formatBytes(n: number | undefined): string {
  if (!n || n <= 0) return '';
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return Math.round(n / 1024) + ' KB';
  return (n / 1024 / 1024).toFixed(1) + ' MB';
}

/** "1200 × 675 · PNG · 302 KB", leaving out what isn't known. */
export function metaLine(img: OgImage): string {
  return [img.width && img.height ? `${img.width} × ${img.height}` : '', img.format || '', formatBytes(img.bytes)].filter(Boolean).join(' · ');
}

/** "OG:IMAGE + TWITTER:IMAGE": every tag that points at the image. */
export const tagLine = (img: OgImage): string => img.tags.join(' + ').toUpperCase();

export const basename = (path: string): string => path.split(/[\\/]/).pop() || path;

/** The plain checks shown on the link preview screen. */
export function checksFor(page: PageInfo, img: OgImage): Check[] {
  const out: Check[] = [];
  if (img.width && img.height) {
    const ratio = img.width / img.height;
    const wide = ratio > 1.7 && ratio < 2.1;
    if (img.width < 600) out.push({ ok: false, text: `Image is ${img.width} × ${img.height}, small enough that some apps show a tiny thumbnail` });
    else if (!wide) out.push({ ok: false, text: `Image is ${img.width} × ${img.height}; most apps crop to about 1.91:1` });
    else out.push({ ok: true, text: `Image is ${img.width} × ${img.height}, a size most apps expect` });
  }
  if (page.title && page.description) out.push({ ok: true, text: 'Title and description are set' });
  else out.push({ ok: false, text: page.title ? 'No description for the link' : 'No title for the link' });
  out.push(img.alt ? { ok: true, text: 'Image has alt text' } : { ok: false, text: 'No alt text for the image' });
  if (!img.tags.includes('twitter:image') && img.tags.includes('og:image')) out.push({ ok: true, text: 'No twitter:image, so X uses the og:image' });
  return out;
}
