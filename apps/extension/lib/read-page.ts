import type { Framework, RawPage } from './types';

/**
 * Runs inside the page (chrome.scripting.executeScript), so it must not use
 * anything from outside its own body.
 */
export function readPage(): RawPage {
  const abs = (u: string): string => {
    try {
      const url = new URL(u, document.baseURI);
      return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : '';
    } catch {
      return '';
    }
  };
  const images: RawPage['images'] = [];
  const add = (tag: string, content: string) => {
    const url = abs(content);
    if (!url) return null;
    let it = images.find((i) => i.url === url);
    if (!it) images.push((it = { url, tags: [] }));
    if (!it.tags.includes(tag)) it.tags.push(tag);
    return it;
  };
  const named: Record<string, string> = {};
  let og: RawPage['images'][number] | null = null;
  let tw: RawPage['images'][number] | null = null;

  for (const m of Array.from(document.querySelectorAll('meta'))) {
    const key = (m.getAttribute('property') || m.getAttribute('name') || '').trim().toLowerCase();
    const content = (m.getAttribute('content') || '').trim();
    if (!key || !content) continue;
    if (!(key in named)) named[key] = content;
    if (key === 'og:image' || key === 'og:image:url') og = add('og:image', content);
    else if (key === 'og:image:secure_url') {
      const url = abs(content);
      // Same picture over https: prefer it over an http og:image rather than list it twice.
      if (og && url && og.url.replace(/^http:/, 'https:') === url) og.url = url;
      else if (!og) og = add('og:image', content);
    } else if (key === 'og:image:width' && og) og.width = parseInt(content, 10) || undefined;
    else if (key === 'og:image:height' && og) og.height = parseInt(content, 10) || undefined;
    else if (key === 'og:image:alt' && og) og.alt = content;
    else if (key === 'og:image:type' && og) og.type = content;
    else if (key === 'twitter:image' || key === 'twitter:image:src')
      tw = add('twitter:image', content);
    else if (key === 'twitter:image:alt' && tw && !tw.alt) tw.alt = content;
  }

  let largest: RawPage['largest'] = null;
  let area = 0;
  for (const img of Array.from(document.images)) {
    const w = img.naturalWidth,
      h = img.naturalHeight;
    const url = abs(img.currentSrc || img.src);
    if (!url || w < 300 || h < 150 || w * h <= area) continue;
    area = w * h;
    largest = { url, width: w, height: h, alt: img.alt || undefined };
  }

  const generator = (named['generator'] || '').toLowerCase();
  const has = (sel: string) => !!document.querySelector(sel);
  const inScript = (text: string) =>
    Array.from(document.scripts).some((el) => !el.src && (el.textContent || '').includes(text));
  const byGenerator: [string, Framework][] = [
    ['wordpress', 'wordpress'],
    ['ghost', 'ghost'],
    ['hugo', 'hugo'],
    ['jekyll', 'jekyll'],
    ['eleventy', 'eleventy'],
    ['docusaurus', 'docusaurus'],
    ['gatsby', 'gatsby'],
    ['astro', 'astro'],
  ];
  let framework: Framework | null =
    byGenerator.find(([word]) => generator.includes(word))?.[1] ?? null;
  if (!framework) {
    if (has('#__NEXT_DATA__, script[src*="/_next/"]')) framework = 'nextjs';
    else if (has('#__nuxt, #__NUXT_DATA__, script[src*="/_nuxt/"]')) framework = 'nuxt';
    else if (has('[href*="/_app/immutable/"], script[src*="/_app/immutable/"]'))
      framework = 'sveltekit';
    else if (has('astro-island, [href*="/_astro/"], script[src*="/_astro/"]')) framework = 'astro';
    else if (has('#___gatsby')) framework = 'gatsby';
    else if (inScript('__reactRouterContext') || inScript('__remixContext'))
      framework = 'reactrouter';
    else if (has('[href*="/wp-content/"], [src*="/wp-content/"], [src*="/wp-includes/"]'))
      framework = 'wordpress';
    else if (has('script[src*="cdn.shopify.com"], link[href*="cdn.shopify.com"]'))
      framework = 'shopify';
    else if (has('meta[name="csrf-param"][content="authenticity_token"]')) framework = 'rails';
  }

  return {
    url: location.href,
    title: named['og:title'] || named['twitter:title'] || document.title || '',
    description:
      named['og:description'] || named['twitter:description'] || named['description'] || '',
    images,
    largest,
    framework,
  };
}
