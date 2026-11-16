import type { Framework, OgImage, PageInfo } from './types';

export const FRAMEWORKS: { id: Framework; label: string }[] = [
  { id: 'nextjs', label: 'NEXT.JS' },
  { id: 'astro', label: 'ASTRO' },
  { id: 'wordpress', label: 'WORDPRESS' },
  { id: 'html', label: 'PLAIN HTML' },
];

const HOW: Record<Framework, string> = {
  nextjs: `Stack: Next.js App Router.
- Add an \`opengraph-image.tsx\` route (ImageResponse from \`next/og\`) for each content route, e.g. \`app/blog/[slug]/opengraph-image.tsx\`, plus one at \`app/\` as the site default.
- Read the page's title (and date or author if the layout has room) from the same source the page uses.
- Export \`alt\`, \`size\` and \`contentType\`. Load my fonts as ArrayBuffers; do not rely on system fonts.
- Let Next.js emit the meta tags from the file convention; remove any hand-written og:image tags that would clash.`,
  astro: `Stack: Astro.
- Add an endpoint such as \`src/pages/og/[...slug].png.ts\` that renders the image with \`satori\` and converts it with \`@resvg/resvg-js\`, using \`getStaticPaths\` over my content collections so images are built at build time.
- Read the title (and date or author if the layout has room) from each entry's frontmatter.
- In my base layout's <head>, set og:image, og:image:width, og:image:height, og:image:alt, twitter:card=summary_large_image and twitter:image to the absolute URL (use \`Astro.site\`).`,
  wordpress: `Stack: WordPress (PHP, my active theme or a small plugin, not a page builder).
- Generate one image per post with GD or Imagick when a post is saved (\`save_post\`), store it in uploads and keep its ID in post meta. Regenerate when the title changes.
- Output og:image, og:image:width, og:image:height, og:image:alt, twitter:card=summary_large_image and twitter:image in \`wp_head\`.
- If an SEO plugin (Yoast, Rank Math, SEOPress) is active, hook into its image filter instead of printing a second set of tags.`,
  html: `Stack: plain HTML, no framework.
- Write a small Node script (\`satori\` + \`@resvg/resvg-js\`, or Playwright screenshotting an HTML template) that reads each page's <title> and writes \`/og/<page>.png\`.
- Add og:image, og:image:width, og:image:height, og:image:alt, twitter:card=summary_large_image and twitter:image to each page's <head> with absolute URLs.
- Add an npm script so the images are rebuilt before each deploy.`,
};

export function buildPrompt(p: {
  framework: Framework;
  image: OgImage;
  page: PageInfo;
  palette: string[];
}): string {
  const { image, page, palette, framework } = p;
  const w = image.width || 1200,
    h = image.height || 630;
  const ratio = (w / h).toFixed(2);
  const lines = [
    `Build Open Graph (share) images for every page of my site, in the style of a reference I like.`,
    ``,
    `Reference (for style only): ${image.url}`,
    `Seen on: ${page.url}`,
    `- Size ${w} × ${h} px (${ratio}:1)${image.format ? ', ' + image.format : ''}. Look at the image itself before you start.`,
    palette.length
      ? `- Its main colours, measured: ${palette.join(', ')}. Use these only to understand contrast and how much of the frame each tone covers.`
      : `- Note its contrast, how much of the frame is empty, and where the text sits.`,
    `- Study the layout: grid, margins, type size against the frame, how the title wraps, where a logo or label sits.`,
    ``,
    `Rules`,
    `- Borrow the structure, not the identity. Use my brand colours, my fonts and my logo. Never copy the reference site's logo, artwork, wording or exact palette.`,
    `- Find my colours and fonts in the codebase (theme, CSS variables, Tailwind config). If you can't, ask me before inventing any.`,
    `- Output ${w === 1200 && h === 630 ? '1200 × 630' : `1200 × 630 (the reference is ${w} × ${h}; keep 1200 × 630 unless I say otherwise)`} PNG, under 300 KB where possible.`,
    `- Each page gets its own image with its own title. Long titles must wrap or shrink, never overflow or get cut mid-word.`,
    `- Keep text inside a safe area of about 60 px from each edge; some apps crop the sides.`,
    `- Write real alt text for og:image:alt (the page title is an acceptable default).`,
    ``,
    HOW[framework],
    ``,
    `When you're done`,
    `- List the files you added or changed.`,
    `- Tell me how to preview one image locally, and show the final <head> tags for one page.`,
    `- Check a title of 3 words and one of 15 words, and tell me what each looked like.`,
  ];
  return lines.join('\n');
}

/** Up to five dominant colours as hex, or [] when the image's server doesn't allow reading its pixels. */
export async function samplePalette(url: string): Promise<string[]> {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    await img.decode();
    const W = 48,
      H = Math.max(1, Math.round((48 * img.naturalHeight) / img.naturalWidth));
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0, W, H);
    const d = ctx.getImageData(0, 0, W, H).data;
    const buckets = new Map<number, { n: number; r: number; g: number; b: number }>();
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i]!,
        g = d[i + 1]!,
        b = d[i + 2]!;
      if (d[i + 3]! < 128) continue;
      const key = ((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5);
      const k = buckets.get(key) || { n: 0, r: 0, g: 0, b: 0 };
      k.n++;
      k.r += r;
      k.g += g;
      k.b += b;
      buckets.set(key, k);
    }
    const hex = (v: number) => Math.round(v).toString(16).padStart(2, '0');
    return [...buckets.values()]
      .sort((a, b) => b.n - a.n)
      .slice(0, 5)
      .map((k) => '#' + hex(k.r / k.n) + hex(k.g / k.n) + hex(k.b / k.n));
  } catch {
    return [];
  }
}
