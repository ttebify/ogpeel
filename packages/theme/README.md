# @ogpeel/theme

The look shared by the popup and ogpeel.com, in one file, `theme.css`: the bundled fonts, the day and night colours, and the Tailwind tokens both apps use.

Import it after Tailwind's theme layer:

```css
@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities);
@import '@ogpeel/theme/theme.css';
```

Only what both apps need goes here. Components stay in each app, because the popup uses Preact and the site uses Astro.
