import { describe, expect, it } from 'vitest';
import { buildPrompt, FRAMEWORKS } from '../lib/prompt';
import type { Framework, OgImage, PageInfo } from '../lib/types';

const image: OgImage = { url: 'https://ref.com/og.png', tags: ['og:image'], width: 1200, height: 675, format: 'PNG' };
const page: PageInfo = { url: 'https://ref.com/post', host: 'ref.com', title: 'Post', description: '', hasLargest: false };
const phrase: Record<Framework, string> = {
  nextjs: 'opengraph-image.tsx',
  astro: 'getStaticPaths',
  wordpress: 'wp_head',
  html: 'plain HTML',
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
    expect(buildPrompt({ framework: 'html', image, page, palette: [] })).not.toContain('main colours');
    const p = buildPrompt({ framework: 'html', image, page, palette: ['#112233', '#ffffff'] });
    expect(p).toContain('Its main colours, measured: #112233, #ffffff');
  });
});
