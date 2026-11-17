import { describe, expect, it } from 'vitest';
import { buildPrompt, FRAMEWORKS, lockedPreview } from '@/lib/prompt';
import type { Framework, OgImage, PageInfo } from '@/lib/types';

const image: OgImage = {
  url: 'https://ref.com/og.png',
  tags: ['og:image'],
  width: 1200,
  height: 675,
  format: 'PNG',
};
const page: PageInfo = {
  url: 'https://ref.com/post',
  host: 'ref.com',
  title: 'Post',
  description: '',
  hasLargest: false,
  framework: null,
};
const phrase: Record<Framework, string> = {
  nextjs: 'opengraph-image.tsx',
  astro: 'getStaticPaths',
  wordpress: 'wp_head',
  html: 'plain HTML',
  nuxt: 'nuxt-og-image',
  sveltekit: '+server.ts',
  reactrouter: 'resource route',
  tanstack: 'head()',
  gatsby: 'Gatsby Head API',
  vite: 'prerender',
  hugo: 'images.Text',
  eleventy: 'eleventy.after',
  jekyll: 'jekyll-seo-tag',
  docusaurus: 'postBuild',
  laravel: 'Blade',
  django: 'Pillow',
  rails: 'content_for',
  shopify: 'metafield',
  ghost: '@tryghost/admin-api',
};

describe('buildPrompt', () => {
  for (const { id } of FRAMEWORKS) {
    it(`includes the essentials for ${id}`, () => {
      const p = buildPrompt({ framework: id, image, page, palette: [] });
      expect(p).toContain('https://ref.com/og.png');
      expect(p).toContain('https://ref.com/post');
      expect(p).toContain('1200 × 675');
      expect(p).toContain(phrase[id]);
    });
  }

  it('includes the palette line only when given', () => {
    expect(buildPrompt({ framework: 'html', image, page, palette: [] })).not.toContain(
      'main colours',
    );
    const p = buildPrompt({ framework: 'html', image, page, palette: ['#112233', '#ffffff'] });
    expect(p).toContain('Its main colours, measured: #112233, #ffffff');
  });
});

describe('lockedPreview', () => {
  it('keeps only the opening lines', () => {
    const full = buildPrompt({ framework: 'nextjs', image, page, palette: [] });
    const short = lockedPreview(full);
    expect(short.split('\n')).toHaveLength(5);
    expect(short).not.toContain('opengraph-image.tsx');
    expect(full.startsWith(short.slice(0, -2))).toBe(true);
  });
});
