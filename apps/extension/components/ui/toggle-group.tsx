import type { ComponentProps } from 'preact';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';

const toggleGroupVariants = cva('grid shrink-0 border-(length:--rule-width) border-solid border-border', {
  variants: {
    variant: {
      default: '[&>button]:h-11 [&>button]:text-sm [&>button+button]:border-l-(length:--rule-width)',
      tabs: 'grid-cols-4 [&>button]:h-11 [&>button]:text-xs [&>button+button]:border-l-(length:--rule-width)',
      settings: '[&>button]:h-9 [&>button]:text-xs [&>button+button]:border-l-(length:--rule-width)',
      framework: 'grid-cols-2 [&>button]:h-10 [&>button]:text-xs [&>button:nth-child(odd)]:border-r-(length:--rule-width) [&>button:nth-child(-n+2)]:border-b-(length:--rule-width)',
    },
  },
  defaultVariants: { variant: 'default' },
});

const toggleGroupItemVariants = cva('rounded-md border-0 border-solid border-border p-0 font-mono font-medium tracking-label', {
  variants: {
    selected: {
      true: 'bg-foreground text-background',
      false: 'bg-transparent text-foreground',
    },
  },
});

type ToggleGroupProps = ComponentProps<'div'> & VariantProps<typeof toggleGroupVariants>;
type ToggleGroupItemProps = ComponentProps<'button'> & VariantProps<typeof toggleGroupItemVariants> & { selected: boolean };

export function ToggleGroup({ variant, class: className, ...props }: ToggleGroupProps) {
  return <div class={cn(toggleGroupVariants({ variant }), className as string)} {...props} />;
}

export function ToggleGroupItem({ selected, class: className, ...props }: ToggleGroupItemProps) {
  return <button class={cn(toggleGroupItemVariants({ selected }), className as string)} {...props} />;
}
