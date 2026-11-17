import { beforeEach, describe, expect, it } from 'vitest';
import { readPage } from '@/lib/read-page';

// happy-dom does not implement document.images; browsers do.
if (!('images' in document) || document.images === undefined) {
  Object.defineProperty(document, 'images', {
    configurable: true,
    get: () => document.getElementsByTagName('img'),
  });
}

const set = (head: string, body = '') => {
  document.head.innerHTML = head;
  document.body.innerHTML = body;
};

describe('readPage', () => {
  beforeEach(() => set(''));

  it('reads a lone og:image', () => {
    set('<meta property="og:image" content="https://example.com/a.png">');
    const p = readPage();
    expect(p.images).toEqual([{ url: 'https://example.com/a.png', tags: ['og:image'] }]);
    expect(p.largest).toBeNull();
  });

  it('merges og and twitter tags pointing at the same URL', () => {
    set(
      '<meta property="og:image" content="https://example.com/a.png"><meta name="twitter:image" content="https://example.com/a.png">',
    );
    const p = readPage();
    expect(p.images).toHaveLength(1);
    expect(p.images[0]!.tags).toEqual(['og:image', 'twitter:image']);
  });

  it('lists different og and twitter images in document order', () => {
    set(
      '<meta name="twitter:image" content="https://example.com/t.png"><meta property="og:image" content="https://example.com/o.png">',
    );
    const p = readPage();
    expect(p.images.map((i) => [i.url, i.tags])).toEqual([
      ['https://example.com/t.png', ['twitter:image']],
      ['https://example.com/o.png', ['og:image']],
    ]);
  });

  it('attaches width, height and alt to the og:image they follow', () => {
    set(`
      <meta property="og:image" content="https://example.com/1.png">
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="630">
      <meta property="og:image:alt" content="First">
      <meta property="og:image" content="https://example.com/2.png">
      <meta property="og:image:width" content="800">
      <meta property="og:image:height" content="800">
      <meta property="og:image:alt" content="Second">`);
    const [a, b] = readPage().images;
    expect(a).toMatchObject({
      url: 'https://example.com/1.png',
      width: 1200,
      height: 630,
      alt: 'First',
    });
    expect(b).toMatchObject({
      url: 'https://example.com/2.png',
      width: 800,
      height: 800,
      alt: 'Second',
    });
  });

  it('accepts name= instead of property=', () => {
    set(
      '<meta name="og:image" content="https://example.com/a.png"><meta name="og:title" content="T">',
    );
    const p = readPage();
    expect(p.images[0]!.url).toBe('https://example.com/a.png');
    expect(p.title).toBe('T');
  });

  it('prefers the https secure_url twin of an http og:image', () => {
    set(
      '<meta property="og:image" content="http://example.com/a.png"><meta property="og:image:secure_url" content="https://example.com/a.png">',
    );
    const p = readPage();
    expect(p.images).toEqual([{ url: 'https://example.com/a.png', tags: ['og:image'] }]);
  });

  it('resolves relative URLs against <base>', () => {
    set('<base href="https://example.com/blog/"><meta property="og:image" content="img/a.png">');
    expect(readPage().images[0]!.url).toBe('https://example.com/blog/img/a.png');
  });

  it('ignores empty content and javascript:/data: URLs', () => {
    set(`
      <meta property="og:image" content="">
      <meta property="og:image" content="javascript:alert(1)">
      <meta name="twitter:image" content="data:image/png;base64,AAAA">`);
    expect(readPage().images).toEqual([]);
  });

  it('returns no images when there are no tags', () => {
    set('<title>Hi</title>', '<p>text</p>');
    const p = readPage();
    expect(p.images).toEqual([]);
    expect(p.largest).toBeNull();
  });

  it('title falls back og:title -> twitter:title -> document.title', () => {
    set(
      '<title>Doc</title><meta name="twitter:title" content="Tw"><meta property="og:title" content="Og">',
    );
    expect(readPage().title).toBe('Og');
    set('<title>Doc</title><meta name="twitter:title" content="Tw">');
    expect(readPage().title).toBe('Tw');
    set('<title>Doc</title>');
    expect(readPage().title).toBe('Doc');
  });

  it('description falls back og -> twitter -> meta description', () => {
    set(
      '<meta name="description" content="M"><meta name="twitter:description" content="Tw"><meta property="og:description" content="Og">',
    );
    expect(readPage().description).toBe('Og');
    set('<meta name="description" content="M"><meta name="twitter:description" content="Tw">');
    expect(readPage().description).toBe('Tw');
    set('<meta name="description" content="M">');
    expect(readPage().description).toBe('M');
  });
});

describe('readPage framework', () => {
  const cases: [string, string, string, string | null][] = [
    ['WordPress by generator', '<meta name="generator" content="WordPress 6.6">', '', 'wordpress'],
    ['Hugo by generator', '<meta name="generator" content="Hugo 0.139.0">', '', 'hugo'],
    ['Ghost by generator', '<meta name="generator" content="Ghost 5.100">', '', 'ghost'],
    ['Astro by generator', '<meta name="generator" content="Astro v5.1.0">', '', 'astro'],
    [
      'Next.js by its data script',
      '',
      '<script id="__NEXT_DATA__" type="application/json">{}</script>',
      'nextjs',
    ],
    [
      'Next.js by its chunks',
      '<script src="/_next/static/chunks/main.js" defer></script>',
      '',
      'nextjs',
    ],
    ['Nuxt by its root', '', '<div id="__nuxt"></div>', 'nuxt'],
    [
      'SvelteKit by its assets',
      '<link rel="modulepreload" href="/_app/immutable/entry/start.js">',
      '',
      'sveltekit',
    ],
    ['Astro by an island', '', '<astro-island></astro-island>', 'astro'],
    ['Gatsby by its root', '', '<div id="___gatsby"></div>', 'gatsby'],
    [
      'React Router by its context',
      '',
      '<script>window.__reactRouterContext = {};</script>',
      'reactrouter',
    ],
    ['Remix by its context', '', '<script>window.__remixContext = {};</script>', 'reactrouter'],
    [
      'WordPress by its theme files',
      '<link rel="stylesheet" href="/wp-content/themes/x/style.css">',
      '',
      'wordpress',
    ],
    [
      'Shopify by its CDN',
      '<link rel="stylesheet" href="https://cdn.shopify.com/s/files/theme.css">',
      '',
      'shopify',
    ],
    ['Rails by its CSRF tag', '<meta name="csrf-param" content="authenticity_token">', '', 'rails'],
    ['nothing on a plain page', '<title>Hi</title>', '<p>Hello</p>', null],
  ];
  for (const [name, head, body, want] of cases) {
    it(`detects ${name}`, () => {
      set(head, body);
      expect(readPage().framework).toBe(want);
    });
  }

  it('prefers the generator tag over markup', () => {
    set('<meta name="generator" content="Docusaurus v3.5">', '<div id="__nuxt"></div>');
    expect(readPage().framework).toBe('docusaurus');
  });
});
