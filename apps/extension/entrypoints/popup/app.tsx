import { useEffect, useRef, useState } from 'preact/hooks';
import { browser } from 'wxt/browser';
import { copyImageToClipboard, downloadImage, probe, targetTab } from '@/lib/browser-actions';
import { SITE_PAGES } from '@/lib/config';
import { activateKey } from '@/lib/license';
import { buildPrompt, samplePalette } from '@/lib/prompt';
import { readPage } from '@/lib/read-page';
import { DEFAULT_LICENSE, DEFAULT_SETTINGS, loadPrefs, saveLicense, saveSettings } from '@/lib/storage';
import type { Actions, OgImage, PageInfo, RawPage, State } from '@/lib/types';
import { checksFor, formatOf, hostOf } from '@/lib/util';
import { AllImages } from '@/entrypoints/popup/screens/all-images';
import { Copied } from '@/entrypoints/popup/screens/copied';
import { Dev } from '@/entrypoints/popup/screens/dev';
import { Empty } from '@/entrypoints/popup/screens/empty';
import { EnterKey } from '@/entrypoints/popup/screens/enter-key';
import { Failed } from '@/entrypoints/popup/screens/failed';
import { Loading } from '@/entrypoints/popup/screens/loading';
import { Popup } from '@/entrypoints/popup/screens/popup';
import { Preview } from '@/entrypoints/popup/screens/preview';
import { SavedScreen } from '@/entrypoints/popup/screens/saved';
import { SettingsScreen } from '@/entrypoints/popup/screens/settings';
import { Unlock } from '@/entrypoints/popup/screens/unlock';

const initial: State = {
  status: 'loading', route: 'popup', page: null, images: [], current: 0, restricted: false, usingLargest: false,
  saved: null, copied: null, busy: null, error: null, settings: DEFAULT_SETTINGS, license: DEFAULT_LICENSE,
  framework: 'nextjs', prompt: '', checks: [], keyError: false,
};

export function App() {
  const [s, setS] = useState<State>(initial);
  const ref = useRef(s);
  ref.current = s;
  const set = (p: Partial<State>) => setS((prev) => ({ ...prev, ...p }));
  const raw = useRef<RawPage | null>(null);
  const palette = useRef<{ url: string; colors: string[] } | null>(null);

  /** Shows a list of images: measures the first, then the rest in the background. */
  async function show(page: PageInfo, images: OgImage[], usingLargest: boolean) {
    const head = images[0];
    if (!head) return;
    const first = await probe(head.url);
    if (!first) {
      set({ status: 'failed', page, images: [{ ...head, broken: true }, ...images.slice(1)], current: 0, usingLargest });
      return;
    }
    const sized: OgImage = { ...head, ...first };
    images = [sized, ...images.slice(1)];
    set({ status: 'ready', page, images, current: 0, usingLargest, checks: checksFor(page, sized) });
    images.slice(1).forEach(async (img, i) => {
      const size = await probe(img.url);
      setS((prev) => {
        if (prev.images[i + 1]?.url !== img.url) return prev;
        const next = prev.images.slice();
        next[i + 1] = size ? { ...img, ...size } : { ...img, broken: true };
        return { ...prev, images: next };
      });
    });
  }

  async function load() {
    set({ status: 'loading', route: 'popup', error: null, restricted: false });
    const tab = await targetTab().catch(() => undefined);
    const blank: PageInfo = { url: tab?.url || '', host: hostOf(tab?.url), title: tab?.title || '', description: '', hasLargest: false };
    if (!tab?.id || !/^https?:/i.test(tab.url || '')) return set({ status: 'empty', restricted: true, page: blank, images: [] });
    try {
      const res = await browser.scripting.executeScript({ target: { tabId: tab.id }, func: readPage });
      raw.current = (res[0]?.result as RawPage) || null;
    } catch {
      raw.current = null;
    }
    const r = raw.current;
    if (!r) return set({ status: 'empty', restricted: true, page: blank, images: [] });
    const page: PageInfo = { url: r.url, host: hostOf(r.url), title: r.title, description: r.description, hasLargest: !!r.largest };
    const images: OgImage[] = r.images.map((i) => ({ url: i.url, tags: i.tags, width: i.width, height: i.height, alt: i.alt, format: formatOf(i.url) }));
    if (!images.length) return set({ status: 'empty', page, images: [] });
    await show(page, images, false);
  }

  useEffect(() => {
    loadPrefs().then(set).catch(() => {});
    load();
  }, []);

  // Day or night look, following the system when set to auto.
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const look = s.settings.look === 'auto' ? (mq.matches ? 'night' : 'day') : s.settings.look;
      document.documentElement.dataset.look = look;
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [s.settings.look]);

  // The developer prompt follows the image and the framework.
  const img = s.images[s.current];
  useEffect(() => {
    if (s.route !== 'dev' || !img || !s.page) return;
    let live = true;
    const make = (colors: string[]) => live && set({ prompt: buildPrompt({ framework: s.framework, image: img, page: s.page!, palette: colors }) });
    if (palette.current?.url === img.url) make(palette.current.colors);
    else {
      make([]);
      samplePalette(img.url).then((colors) => { palette.current = { url: img.url, colors }; make(colors); });
    }
    return () => { live = false; };
  }, [s.route, s.framework, img?.url, img?.width]);

  const flash = (copied: State['copied']) => {
    set({ copied, busy: null, error: null });
    setTimeout(() => setS((prev) => (prev.copied === copied ? { ...prev, copied: null } : prev)), 1800);
  };

  const a: Actions = {
    go: (route) => set({ route, error: null, keyError: false }),
    select: (current) => {
      const cur = ref.current;
      if (cur.images[current] && cur.page) set({ current, route: 'popup', checks: checksFor(cur.page, cur.images[current]) });
    },
    retry: () => { load(); },
    showLargest: () => {
      const r = raw.current, page = ref.current.page;
      if (!r?.largest || !page) return;
      set({ status: 'loading' });
      show(page, [{ url: r.largest.url, tags: ['largest image'], alt: r.largest.alt, format: formatOf(r.largest.url) }], true);
    },
    download: async (index) => {
      const cur = ref.current, i = index ?? cur.current, image = cur.images[i];
      if (!image || !cur.page || cur.busy) return;
      set({ busy: 'download', error: null });
      try {
        const saved = await downloadImage(image, cur.page, cur.settings.naming);
        setS((prev) => {
          const images = prev.images.slice();
          images[i] = { ...images[i]!, format: saved.image.format, bytes: saved.image.bytes };
          return { ...prev, images, saved, busy: null, route: 'saved' };
        });
      } catch {
        set({ busy: null, error: "That didn't download. Try again, or copy the link." });
      }
    },
    downloadAll: async () => {
      const cur = ref.current;
      if (!cur.page || cur.busy) return;
      set({ busy: 'download', error: null });
      const list = cur.images.map((image, i) => ({ image, i })).filter((x) => !x.image.broken);
      const done: Awaited<ReturnType<typeof downloadImage>>[] = [];
      for (const [n, x] of list.entries()) {
        try { done.push(await downloadImage(x.image, cur.page, cur.settings.naming, n)); } catch { /* keep going */ }
      }
      if (!done.length) return set({ busy: null, error: "Those didn't download. Try one at a time." });
      set({ busy: null, saved: { ...done[0]!, count: done.length }, route: 'saved' });
    },
    showInFolder: () => {
      const id = ref.current.saved?.id;
      if (id !== undefined) browser.downloads.show(id);
    },
    copyImage: async () => {
      const cur = ref.current, image = cur.images[cur.current];
      if (!image || !cur.page || cur.busy) return;
      set({ busy: 'copy', error: null });
      try {
        await copyImageToClipboard(image, cur.page, cur.settings.keepSource);
        flash('image');
      } catch (e) {
        const denied = e instanceof Error && e.message === 'permission';
        set({ busy: null, error: denied ? "Ogpeel needs your OK to read this image's site before it can copy it." : "That didn't copy. Download it instead." });
      }
    },
    copyLink: async () => {
      const image = ref.current.images[ref.current.current];
      if (!image) return;
      try { await navigator.clipboard.writeText(image.url); flash('link'); } catch { set({ error: "That didn't copy." }); }
    },
    setFramework: (framework) => set({ framework }),
    copyPrompt: async () => {
      const cur = ref.current;
      if (!cur.prompt) return;
      if (!cur.license.unlocked && cur.license.freeLeft <= 0) return set({ route: 'unlock' });
      try { await navigator.clipboard.writeText(cur.prompt); } catch { return set({ error: "That didn't copy." }); }
      const license = cur.license.unlocked ? cur.license : { ...cur.license, freeLeft: cur.license.freeLeft - 1 };
      saveLicense(license);
      set({ license, route: 'copied' });
    },
    submitKey: async (key) => {
      if (ref.current.busy) return;
      set({ busy: 'key', keyError: false });
      const ok = await activateKey(key);
      if (!ok) return set({ busy: null, keyError: true });
      const license = { ...ref.current.license, unlocked: true, key: key.trim() };
      saveLicense(license);
      set({ busy: null, license });
    },
    clearKeyError: () => set({ keyError: false }),
    setSetting: (key, value) => {
      const settings = { ...ref.current.settings, [key]: value };
      saveSettings(settings);
      set({ settings });
    },
    openSite: (page) => { browser.tabs.create({ url: SITE_PAGES[page] }); },
  };

  const p = { s, a };
  switch (s.route) {
    case 'settings': return <SettingsScreen {...p} />;
    case 'key': return <EnterKey {...p} />;
    case 'unlock': return <Unlock {...p} />;
  }
  if (s.status === 'loading') return <Loading {...p} />;
  if (s.status === 'failed') return <Failed {...p} />;
  if (s.status === 'empty') return <Empty {...p} />;
  switch (s.route) {
    case 'all': return <AllImages {...p} />;
    case 'saved': return <SavedScreen {...p} />;
    case 'preview': return <Preview {...p} />;
    case 'dev': return <Dev {...p} />;
    case 'copied': return <Copied {...p} />;
    default: return <Popup {...p} />;
  }
}
