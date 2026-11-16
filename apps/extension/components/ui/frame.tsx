import type { ComponentProps } from 'preact';
import { cn } from 'cn';

export function Frame({ class: className, ...props }: ComponentProps<'div'>) {
  return <div class={cn('flex h-150 w-90 flex-col overflow-hidden bg-background p-4 font-serif text-foreground', className as string)} {...props} />;
}
