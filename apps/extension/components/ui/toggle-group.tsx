import type { ComponentProps } from 'preact';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';

const toggleGroupVariants = cva('grid shrink-0 rule border-border', {
  variants: {
    /** One row with a rule between items (set the columns with `grid-cols-*`), or a 2 × 2 grid. */
    layout: {
      row: '[&>button+button]:rule-l',
      grid: 'grid-cols-2 [&>button:nth-child(odd)]:rule-r [&>button:nth-child(-n+2)]:rule-b',
    },
    /** Item height and label size: 44px/13px, 44px/12px, 40px/12px, 36px/12px. */
    size: {
      lg: '[&>button]:h-11 [&>button]:text-sm',
      md: '[&>button]:h-11 [&>button]:text-xs',
      sm: '[&>button]:h-10 [&>button]:text-xs',
      xs: '[&>button]:h-9 [&>button]:text-xs',
    },
  },
  defaultVariants: { layout: 'row', size: 'lg' },
});

const toggleGroupItemVariants = cva(
  'rounded-md border-border p-0 font-mono font-medium tracking-label',
  {
    variants: {
      selected: {
        true: 'bg-foreground text-background',
        false: 'bg-transparent text-foreground',
      },
    },
  },
);

type ToggleGroupProps = ComponentProps<'div'> & VariantProps<typeof toggleGroupVariants>;
type ToggleGroupItemProps = ComponentProps<'button'> &
  VariantProps<typeof toggleGroupItemVariants> & { selected: boolean };

export function ToggleGroup({ layout, size, class: className, ...props }: ToggleGroupProps) {
  return <div class={cn(toggleGroupVariants({ layout, size }), className as string)} {...props} />;
}

export function ToggleGroupItem({ selected, class: className, ...props }: ToggleGroupItemProps) {
  return (
    <button class={cn(toggleGroupItemVariants({ selected }), className as string)} {...props} />
  );
}
