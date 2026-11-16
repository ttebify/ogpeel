// Shared contract between the popup's logic (App.tsx) and its screens.

export type RawImage = { url: string; tags: string[]; width?: number; height?: number; alt?: string; type?: string };
export type RawPage = {
  url: string;
  title: string;
  description: string;
  images: RawImage[];
  largest: { url: string; width: number; height: number; alt?: string } | null;
};

export type OgImage = {
  url: string;
  /** Tags that point at this file, e.g. ['og:image', 'twitter:image']. */
  tags: string[];
  /** Real pixel size once the image has loaded in the popup. */
  width?: number;
  height?: number;
  alt?: string;
  /** 'PNG', 'JPG', 'WEBP'… when it can be told from the URL or the download. */
  format?: string;
  /** Known only after a download. */
  bytes?: number;
  /** The image URL did not load. */
  broken?: boolean;
};

export type PageInfo = { url: string; host: string; title: string; description: string; hasLargest: boolean };

export type Naming = 'title' | 'original';
export type Look = 'auto' | 'day' | 'night';
export type Settings = { naming: Naming; look: Look; keepSource: boolean };
export type License = { unlocked: boolean; key?: string; freeLeft: number };

export type Framework = 'nextjs' | 'astro' | 'wordpress' | 'html';
export type Network = 'x' | 'linkedin' | 'slack' | 'whatsapp';

export type Route = 'popup' | 'all' | 'saved' | 'preview' | 'dev' | 'copied' | 'unlock' | 'key' | 'settings';
/** What the 'popup' route shows. */
export type Status = 'loading' | 'ready' | 'empty' | 'failed';

export type Saved = { id: number; filename: string; bytes?: number; image: OgImage; count: number };
export type Check = { ok: boolean; text: string };

export type State = {
  status: Status;
  route: Route;
  page: PageInfo | null;
  images: OgImage[];
  /** Index into images of the one the popup shows. */
  current: number;
  /** The browser does not let extensions read this page (settings pages, the store, PDFs). */
  restricted: boolean;
  /** Showing the page's largest picture because it sets no share image. */
  usingLargest: boolean;
  saved: Saved | null;
  /** Which copy button just succeeded; clears itself after a moment. */
  copied: 'image' | 'link' | null;
  /** An action in flight, for disabling buttons. */
  busy: 'download' | 'copy' | 'key' | null;
  /** A short sentence to show when an action failed, else null. */
  error: string | null;
  settings: Settings;
  license: License;
  framework: Framework;
  /** The developer prompt for the current image and framework. */
  prompt: string;
  checks: Check[];
  keyError: boolean;
};

export type Actions = {
  go(route: Route): void;
  select(index: number): void;
  retry(): void;
  showLargest(): void;
  download(index?: number): void;
  downloadAll(): void;
  showInFolder(): void;
  copyImage(): void;
  copyLink(): void;
  setFramework(f: Framework): void;
  copyPrompt(): void;
  submitKey(key: string): void;
  clearKeyError(): void;
  setSetting<K extends keyof Settings>(key: K, value: Settings[K]): void;
  /** Opens a page of ogpeel.com in a new tab: 'pricing' | 'coffee' | 'key' | 'privacy'. */
  openSite(page: 'pricing' | 'coffee' | 'key' | 'privacy'): void;
};

export type ScreenProps = { s: State; a: Actions };
