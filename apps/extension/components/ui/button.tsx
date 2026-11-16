import type { ComponentProps } from 'preact';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';

const buttonVariants = cva('flex shrink-0 items-center justify-center rounded-md', {
  variants: {
    variant: {
      outline: 'h-12 w-full border-(length:--rule-width) border-solid border-border bg-transparent px-2 py-0 text-foreground font-mono text-sm font-medium tracking-label',
      solid: 'h-12 w-full border-(length:--rule-width) border-solid border-border bg-foreground px-2 py-0 font-mono text-sm font-medium tracking-label text-background',
      action: 'h-12 w-full border-(length:--rule-width) border-solid border-border bg-primary px-2 py-0 font-mono text-sm font-medium tracking-label text-primary-foreground shadow-offset',
      link: 'border-0 bg-transparent p-0 text-foreground tracking-[inherit] underline',
      'italic-link': 'h-11 w-full border-0 bg-transparent p-0 text-foreground text-base italic underline',
      'mono-link': 'h-11 w-full border-0 bg-transparent p-0 text-foreground font-mono text-xs tracking-label underline',
      row: 'h-11 w-full text-foreground justify-between border-0 border-b-(length:--rule-width) border-solid border-border bg-transparent p-0 text-left font-mono text-xs tracking-label',
      external: 'h-10 w-full text-foreground justify-between border-0 border-b border-solid border-border bg-transparent p-0 font-serif text-base',
      icon: 'size-11 text-foreground border-0 bg-transparent p-0',
      'icon-outline': 'size-11 text-foreground border-(length:--rule-width) border-solid border-border bg-transparent p-0 font-mono text-base',
    },
    size: {
      default: '',
      compact: 'h-11',
    },
  },
  defaultVariants: { variant: 'outline', size: 'default' },
});

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>;

export function Button({ variant, size, class: className, ...props }: ButtonProps) {
  return <button class={cn(buttonVariants({ variant, size }), className as string)} {...props} />;
}
