# @ogpeel/theme

The paper look shared by the extension popup and ogpeel.com. One file, `theme.css`:

- the bundled fonts (Newsreader, IBM Plex Mono);
- the shadcn-named colour variables, for day and for `data-look="night"`;
- the Tailwind theme tokens both apps use: spacing, type sizes, `rule` and `rule-b` for the 1.5px ink rule, `shadow-offset` for depth;
- the base rules: no border unless a utility sets one, and the focus outline.

Import it after Tailwind's theme layer:

```css
@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities);
@import '@ogpeel/theme/theme.css';
```

What belongs here is what must be identical in both places. Components do not: the popup is Preact and the site is Astro, so each app keeps its own, built from these tokens. Sizes that only make sense in one place (the 360 × 600 popup, the site's display type) stay in that app's stylesheet.
