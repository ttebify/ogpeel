import type { ComponentProps } from 'preact';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';

/** The bordered buttons: full width, a mono label. `size` sets their height. */
const boxed = 'w-full rule border-border px-2 py-0 font-mono text-sm font-medium tracking-label';

const buttonVariants = cva('box-border flex shrink-0 items-center justify-center rounded-md', {
  variants: {
    variant: {
      outline: `${boxed} bg-transparent text-foreground`,
      solid: `${boxed} bg-foreground text-background`,
      /** Vermilion: saves a file or pays. */
      action: `${boxed} bg-primary text-primary-foreground shadow-offset`,
      link: 'bg-transparent p-0 text-foreground tracking-[inherit] underline',
      'italic-link': 'h-11 w-full bg-transparent p-0 text-base text-foreground italic underline',
      'mono-link':
        'h-11 w-full bg-transparent p-0 font-mono text-xs tracking-label text-foreground underline',
      /** A full-width line with a rule under it: words on the left, an arrow on the right. */
      row: 'h-11 w-full justify-between rule-b border-border bg-transparent p-0 text-left font-mono text-xs tracking-label text-foreground',
      /** The same line for links that leave the popup. */
      external:
        'h-10 w-full justify-between border-b border-border bg-transparent p-0 font-serif text-base text-foreground',
      icon: 'size-11 bg-transparent p-0 text-foreground',
      'icon-outline':
        'size-11 rule border-border bg-transparent p-0 font-mono text-base text-foreground',
    },
    /** Applies to the bordered buttons only; the others carry their own height. */
    size: { default: '', compact: '' },
  },
  compoundVariants: [
    { variant: ['outline', 'solid', 'action'], size: 'default', class: 'h-12' },
    { variant: ['outline', 'solid', 'action'], size: 'compact', class: 'h-11' },
  ],
  defaultVariants: { variant: 'outline', size: 'default' },
});

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>;

export function Button({ variant, size, class: className, ...props }: ButtonProps) {
  return <button class={cn(buttonVariants({ variant, size }), className as string)} {...props} />;
}
