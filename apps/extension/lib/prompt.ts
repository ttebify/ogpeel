import type { Framework, FrameworkGroup, OgImage, PageInfo } from './types';

export const FRAMEWORK_GROUPS: FrameworkGroup[] = ['JAVASCRIPT', 'STATIC', 'SERVER', 'HOSTED'];

export const FRAMEWORKS: { id: Framework; label: string; group: FrameworkGroup }[] = [
  { id: 'nextjs', label: 'NEXT.JS', group: 'JAVASCRIPT' },
  { id: 'nuxt', label: 'NUXT', group: 'JAVASCRIPT' },
  { id: 'sveltekit', label: 'SVELTEKIT', group: 'JAVASCRIPT' },
  { id: 'astro', label: 'ASTRO', group: 'JAVASCRIPT' },
  { id: 'reactrouter', label: 'REACT ROUTER', group: 'JAVASCRIPT' },
  { id: 'tanstack', label: 'TANSTACK START', group: 'JAVASCRIPT' },
  { id: 'gatsby', label: 'GATSBY', group: 'JAVASCRIPT' },
  { id: 'vite', label: 'VITE SPA', group: 'JAVASCRIPT' },
  { id: 'hugo', label: 'HUGO', group: 'STATIC' },
  { id: 'eleventy', label: 'ELEVENTY', group: 'STATIC' },
  { id: 'jekyll', label: 'JEKYLL', group: 'STATIC' },
  { id: 'docusaurus', label: 'DOCUSAURUS', group: 'STATIC' },
  { id: 'html', label: 'PLAIN HTML', group: 'STATIC' },
  { id: 'laravel', label: 'LARAVEL', group: 'SERVER' },
  { id: 'django', label: 'DJANGO', group: 'SERVER' },
  { id: 'rails', label: 'RAILS', group: 'SERVER' },
  { id: 'wordpress', label: 'WORDPRESS', group: 'HOSTED' },
  { id: 'shopify', label: 'SHOPIFY', group: 'HOSTED' },
  { id: 'ghost', label: 'GHOST', group: 'HOSTED' },
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
  nuxt: `Stack: Nuxt 3 or later.
- Use the \`nuxt-og-image\` module. Add a component in \`components/OgImage/\` that draws the image, and call \`defineOgImageComponent()\` in each content page with that page's title.
- Read the title (and date or author if the layout has room) from the same source the page uses (\`@nuxt/content\` or my data).
- Let the module emit the og:image and twitter:image tags; set og:image:alt and twitter:card=summary_large_image with \`useSeoMeta\`, and remove any hand-written tags that would clash.`,
  sveltekit: `Stack: SvelteKit.
- Add an endpoint such as \`src/routes/og/[...slug].png/+server.ts\` that renders the image with \`satori\` and converts it with \`@resvg/resvg-js\`. Prerender it (\`export const prerender = true\` with \`entries\`) if the site is static.
- Read the title (and date or author if the layout has room) from the same source the page's \`load\` uses.
- In \`<svelte:head>\` of each page or the root layout, set og:image, og:image:width, og:image:height, og:image:alt, twitter:card=summary_large_image and twitter:image to the absolute URL.`,
  reactrouter: `Stack: React Router 7 (framework mode) or Remix.
- Add a resource route such as \`app/routes/og.$slug[.png].tsx\` whose \`loader\` renders the image with \`satori\` and \`@resvg/resvg-js\` and returns it with \`Content-Type: image/png\` and a long cache header.
- Read the title (and date or author if the layout has room) from the same source the page's loader uses.
- In each page route's \`meta\` export, return og:image, og:image:width, og:image:height, og:image:alt, twitter:card=summary_large_image and twitter:image with absolute URLs.`,
  tanstack: `Stack: TanStack Start.
- Add a server route at \`/og/$slug.png\` that renders the image with \`satori\` and \`@resvg/resvg-js\` and returns it as \`image/png\` with a long cache header. Use the server route API of the version in my package.json.
- Read the title (and date or author if the layout has room) from the same loader the page uses.
- In each route's \`head()\` option, return og:image, og:image:width, og:image:height, og:image:alt, twitter:card=summary_large_image and twitter:image with absolute URLs.`,
  gatsby: `Stack: Gatsby.
- In \`gatsby-node\`, after the pages are created, render one image per page with \`satori\` and \`@resvg/resvg-js\` into \`public/og/<slug>.png\`, reading titles from the same GraphQL query the pages use.
- Use the Gatsby Head API (\`export const Head\`) in each template to set og:image, og:image:width, og:image:height, og:image:alt, twitter:card=summary_large_image and twitter:image with absolute URLs (\`siteMetadata.siteUrl\`).
- If \`gatsby-plugin-react-helmet\` or an SEO component already sets these tags, change it instead of adding a second set.`,
  vite: `Stack: a Vite single-page app (React, Vue or Svelte without a server framework).
- Link previews are made by crawlers that do not run JavaScript, so tags added at runtime are not seen. First check whether my built HTML has per-page tags without JS.
- If it doesn't, prerender each route to static HTML at build time (a prerender plugin, or a build script with Playwright) so each page's HTML carries its own tags.
- Render one image per route with \`satori\` and \`@resvg/resvg-js\` into \`public/og/\` in the same build step, and set og:image, og:image:width, og:image:height, og:image:alt, twitter:card=summary_large_image and twitter:image with absolute URLs.`,
  hugo: `Stack: Hugo.
- Generate images with Hugo's own image processing: a base image in \`assets/\`, drawn on with \`images.Text\` (and a font from \`assets/\`) in a partial, once per page. No Node needed.
- Wrap long titles with the filter's \`linespacing\` and a width limit; check the result for long titles.
- In my head partial, set og:image, og:image:width, og:image:height, og:image:alt, twitter:card=summary_large_image and twitter:image with \`.Permalink\` of the generated resource. If the theme already prints these tags, change its partial instead of adding a second set.`,
  eleventy: `Stack: Eleventy (11ty).
- In an \`eleventy.after\` event, render one image per page in \`collections.all\` with \`satori\` and \`@resvg/resvg-js\` into \`_site/og/<slug>.png\`.
- Read the title (and date or author if the layout has room) from each page's front matter.
- In my base layout's <head>, set og:image, og:image:width, og:image:height, og:image:alt, twitter:card=summary_large_image and twitter:image to the absolute URL (my site URL from global data).`,
  jekyll: `Stack: Jekyll.
- Add a Node script, run after \`jekyll build\`, that renders one image per post or page with \`satori\` and \`@resvg/resvg-js\` into \`_site/og/<slug>.png\`, reading titles from front matter. Keep the whole build to one command.
- If \`jekyll-seo-tag\` is in use, set each page's \`image\` (in front matter defaults) instead of printing a second set of tags.
- Otherwise, in \`_includes/head.html\`, set og:image, og:image:width, og:image:height, og:image:alt, twitter:card=summary_large_image and twitter:image with \`absolute_url\`.`,
  docusaurus: `Stack: Docusaurus.
- Write a small local plugin whose \`postBuild\` renders one image per doc and blog post with \`satori\` and \`@resvg/resvg-js\` into the build folder under \`/og/\`.
- Point each page at its image with the \`image\` front matter field (set by the plugin or a script), and set \`themeConfig.image\` as the site default.
- Let Docusaurus emit the tags; don't add a second set by hand.`,
  laravel: `Stack: Laravel.
- Add a route such as \`/og/{slug}.png\` whose controller renders the image (Intervention Image with a bundled font, or \`spatie/browsershot\` over a Blade template) and caches the PNG in storage, so each image is made once and redone only when the title changes.
- Read the title from the same model the page uses.
- In my layout's <head> (\`@section\` / \`@stack\`), set og:image, og:image:width, og:image:height, og:image:alt, twitter:card=summary_large_image and twitter:image with \`url()\`.`,
  django: `Stack: Django.
- Add a view at \`og/<slug>.png\` that renders the image with Pillow and a bundled font file, and cache it (file or cache framework) so each image is made once and redone only when the title changes.
- Read the title from the same model the page uses.
- In my base template, add a block for these tags and fill it per page: og:image, og:image:width, og:image:height, og:image:alt, twitter:card=summary_large_image and twitter:image, with absolute URLs from \`request.build_absolute_uri\`.`,
  rails: `Stack: Ruby on Rails.
- Add a route and controller action for \`/og/:slug.png\` that renders the image (\`ruby-vips\` or MiniMagick with a bundled font, or a headless browser over an ERB template) and caches it, so each image is made once and redone only when the title changes.
- Read the title from the same model the page uses.
- In my layout, \`yield :head\` and set per page, with \`content_for :head\`, og:image, og:image:width, og:image:height, og:image:alt, twitter:card=summary_large_image and twitter:image with absolute URLs.`,
  shopify: `Stack: Shopify (Online Store 2.0 theme, Liquid).
- Liquid can't draw images, so write a small Node script that reads my products, collections, pages and articles through the Admin API, renders each image with \`satori\` and \`@resvg/resvg-js\`, uploads it to Files, and stores it in a metafield such as \`custom.og_image\`.
- In the theme's meta tags snippet (often \`snippets/meta-tags.liquid\`), use that metafield when it is set and fall back to the current \`page_image\`.
- Keep og:image, og:image:width, og:image:height, og:image:alt, twitter:card=summary_large_image and twitter:image in that one snippet; don't print a second set.`,
  ghost: `Stack: Ghost.
- Ghost already prints share tags through \`{{ghost_head}}\`, using each post's Facebook and X card image when set. Don't add tags to the theme.
- Write a small Node script with \`@tryghost/admin-api\` that renders one image per post and page with \`satori\` and \`@resvg/resvg-js\`, uploads it, and sets \`og_image\` and \`twitter_image\` on that post.
- Skip posts that already have a hand-picked card image, and make it safe to run again after new posts.`,
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

/** The first lines of a prompt, shown when no free prompts are left so the full text is not on screen. */
export function lockedPreview(prompt: string, lines = 4): string {
  return prompt.split('\n').slice(0, lines).join('\n') + '\n…';
}
