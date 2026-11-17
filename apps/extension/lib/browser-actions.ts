import { browser } from 'wxt/browser';
import { readPage } from './read-page';
import type { OgImage, PageInfo, RawPage, Saved } from './types';
import { basename, extFromMime, extOf, slug } from './util';

/** The tab the popup was opened on. An e2e build may pass ?tabId= instead. */
export async function targetTab() {
  const forced = new URLSearchParams(location.search).get('tabId');
  if (forced) return browser.tabs.get(Number(forced));
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  return tab;
}

/** Reads the tab's share tags. null = the browser keeps extensions out of this page (settings pages, the store, PDFs). */
export async function readTab(
  tab: { id?: number; url?: string } | undefined,
): Promise<RawPage | null> {
  if (tab?.id === undefined || !/^https?:/i.test(tab.url || '')) return null;
  try {
    const [res] = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: readPage,
    });
    return (res?.result as RawPage) || null;
  } catch {
    return null;
  }
}

/** Loads the image in the popup to learn its real size. null = it didn't load. */
export function probe(url: string, ms = 12000): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const t = setTimeout(() => resolve(null), ms);
    img.onload = () => {
      clearTimeout(t);
      resolve(img.naturalWidth ? { width: img.naturalWidth, height: img.naturalHeight } : null);
    };
    img.onerror = () => {
      clearTimeout(t);
      resolve(null);
    };
    img.src = url;
  });
}

export async function downloadImage(
  img: OgImage,
  page: PageInfo,
  naming: 'title' | 'original',
  n = 0,
): Promise<Saved> {
  const stem =
    naming === 'title' ? slug(page.title, page.host || 'share-image') + (n ? `-${n + 1}` : '') : '';
  const ext = extOf(img.url);
  const opts: { url: string; saveAs: boolean; filename?: string } = { url: img.url, saveAs: false };
  // Chromium only: lets us name the file after the page even when the URL has no extension.
  const onFilename = browser.downloads.onDeterminingFilename;
  let listener: Parameters<typeof onFilename.addListener>[0] | undefined;
  if (stem && ext) opts.filename = `${stem}.${ext}`;
  else if (stem && onFilename) {
    listener = (item, suggest) => {
      if (item.url !== img.url && item.finalUrl !== img.url) return;
      const e =
        extFromMime(item.mime) ||
        (basename(item.filename || '').match(/\.([a-z0-9]{3,4})$/i)?.[1] ?? '');
      suggest({ filename: e ? `${stem}.${e}` : stem });
    };
    onFilename.addListener(listener);
  }
  try {
    const id = await browser.downloads.download(opts);
    if (id === undefined) throw new Error('download refused');
    for (let i = 0; i < 300; i++) {
      const [item] = await browser.downloads.search({ id });
      if (item?.state === 'complete') {
        const format = (extFromMime(item.mime) || extOf(item.filename)).toUpperCase() || img.format;
        const bytes = item.fileSize > 0 ? item.fileSize : undefined;
        return {
          id,
          filename: basename(item.filename),
          image: { ...img, format, bytes },
          count: 1,
          requested: 1,
        };
      }
      if (item?.state === 'interrupted') throw new Error(item.error || 'interrupted');
      await new Promise((r) => setTimeout(r, 100));
    }
    throw new Error('timeout');
  } finally {
    if (listener) onFilename.removeListener(listener);
  }
}

async function fetchBlob(url: string): Promise<Blob> {
  try {
    const r = await fetch(url);
    if (r.ok) return await r.blob();
  } catch {
    /* the image's server doesn't allow reading it from here: ask for that one host below */
  }
  const origin = new URL(url).origin + '/*';
  const granted = await browser.permissions.request({ origins: [origin] });
  if (!granted) throw new Error('permission');
  const r = await fetch(url);
  if (!r.ok) throw new Error('http ' + r.status);
  return r.blob();
}

async function toPng(blob: Blob): Promise<Blob> {
  if (blob.type === 'image/png') return blob;
  const bmp = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(bmp.width, bmp.height);
  canvas.getContext('2d')!.drawImage(bmp, 0, 0);
  return canvas.convertToBlob({ type: 'image/png' });
}

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** Puts the picture on the clipboard as PNG. With keepSource, rich editors also get a link back to the page. */
export async function copyImageToClipboard(
  img: OgImage,
  page: PageInfo,
  keepSource: boolean,
): Promise<void> {
  const png = await toPng(await fetchBlob(img.url));
  const items: Record<string, Blob> = { 'image/png': png };
  if (keepSource) {
    const html = `<img src="${esc(img.url)}" alt="${esc(img.alt || page.title)}"><br><a href="${esc(page.url)}">${esc(page.title || page.host)}</a>`;
    items['text/html'] = new Blob([html], { type: 'text/html' });
  }
  await navigator.clipboard.write([new ClipboardItem(items)]);
}
