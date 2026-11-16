import { describe, expect, it } from 'vitest';
import {
  checksFor,
  extFromMime,
  extOf,
  formatBytes,
  hostOf,
  metaLine,
  slug,
  tagLine,
} from '@/lib/util';
import type { OgImage, PageInfo } from '@/lib/types';

describe('slug', () => {
  it('drops punctuation', () => expect(slug('A calmer interface!')).toBe('a-calmer-interface'));
  it('strips accents', () => expect(slug('Café über naïve')).toBe('cafe-uber-naive'));
  it('removes apostrophes without a dash', () => expect(slug("Don't stop’s")).toBe('dont-stops'));
  it('falls back for emoji-only titles', () => {
    expect(slug('🎉🎉')).toBe('share-image');
    expect(slug('🎉', 'x')).toBe('x');
  });
  it('caps at 80 chars with no trailing dash', () => {
    const s = slug('word '.repeat(40));
    expect(s.length).toBeLessThanOrEqual(80);
    expect(s.endsWith('-')).toBe(false);
    expect(s.startsWith('word-word')).toBe(true);
  });
});

describe('extOf', () => {
  it('ignores query strings', () => expect(extOf('https://x.com/a.png?v=2')).toBe('png'));
  it('returns empty with no extension', () => expect(extOf('https://x.com/image')).toBe(''));
  it('maps jpeg to jpg', () => expect(extOf('https://x.com/a.JPEG')).toBe('jpg'));
  it('returns empty for unknown extensions', () => expect(extOf('https://x.com/a.tiff')).toBe(''));
  it('returns empty for a bad URL', () => expect(extOf('not a url')).toBe(''));
});

describe('extFromMime', () => {
  it('maps known types', () => {
    expect(extFromMime('image/jpeg')).toBe('jpg');
    expect(extFromMime('IMAGE/PNG; charset=binary')).toBe('png');
    expect(extFromMime('image/svg+xml')).toBe('svg');
  });
  it('returns empty for unknown or missing', () => {
    expect(extFromMime('text/html')).toBe('');
    expect(extFromMime(undefined)).toBe('');
  });
});

describe('formatBytes', () => {
  it('formats', () => {
    expect(formatBytes(undefined)).toBe('');
    expect(formatBytes(0)).toBe('');
    expect(formatBytes(500)).toBe('500 B');
    expect(formatBytes(302 * 1024)).toBe('302 KB');
    expect(formatBytes(1.5 * 1024 * 1024)).toBe('1.5 MB');
  });
});

describe('metaLine', () => {
  it('joins all parts', () =>
    expect(
      metaLine({ url: '', tags: [], width: 1200, height: 675, format: 'PNG', bytes: 302 * 1024 }),
    ).toBe('1200 × 675 · PNG · 302 KB'));
  it('omits missing parts', () => {
    expect(metaLine({ url: '', tags: [], format: 'PNG' })).toBe('PNG');
    expect(metaLine({ url: '', tags: [], width: 1200 })).toBe('');
  });
});

describe('hostOf', () => {
  it('strips www', () => expect(hostOf('https://www.example.com/a')).toBe('example.com'));
  it('returns empty for a bad URL', () => {
    expect(hostOf('nope')).toBe('');
    expect(hostOf(undefined)).toBe('');
  });
});

describe('checksFor', () => {
  const page: PageInfo = {
    url: 'https://e.com',
    host: 'e.com',
    title: 'T',
    description: 'D',
    hasLargest: false,
  };
  const img = (o: Partial<OgImage>): OgImage => ({
    url: 'https://e.com/a.png',
    tags: ['og:image', 'twitter:image'],
    ...o,
  });

  it('all ok for 1200x630 with title, description and alt', () => {
    const c = checksFor(page, img({ width: 1200, height: 630, alt: 'A' }));
    expect(c.every((x) => x.ok)).toBe(true);
  });
  it('flags a square image ratio', () => {
    const c = checksFor(page, img({ width: 800, height: 800, alt: 'A' }));
    expect(c.find((x) => x.text.includes('1.91:1'))?.ok).toBe(false);
  });
  it('flags missing alt', () => {
    const c = checksFor(page, img({ width: 1200, height: 630 }));
    expect(c.find((x) => x.text.includes('alt'))?.ok).toBe(false);
  });
});

describe('tagLine', () => {
  it('joins every tag that points at the image', () => {
    expect(tagLine({ url: '', tags: ['og:image', 'twitter:image'] })).toBe(
      'OG:IMAGE + TWITTER:IMAGE',
    );
    expect(tagLine({ url: '', tags: ['og:image'] })).toBe('OG:IMAGE');
  });
});
