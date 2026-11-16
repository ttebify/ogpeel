import { cva, type VariantProps } from 'class-variance-authority';

/** The site's buttons and button-styled links: as wide as their words, with a mono uppercase label. */
export const buttonVariants = cva(
  'box-border flex shrink-0 items-center justify-center rule border-border px-6 py-0 font-mono text-sm font-medium tracking-label uppercase no-underline',
  {
    variants: {
      variant: {
        outline: 'bg-transparent text-foreground',
        solid: 'bg-foreground text-background',
        /** Vermilion: installs or pays. */
        action: 'bg-primary text-primary-foreground shadow-offset',
      },
      size: {
        default: 'min-h-13',
        /** The header. */
        compact: 'min-h-11',
      },
    },
    defaultVariants: { variant: 'outline', size: 'default' },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
