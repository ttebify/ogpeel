import type { ComponentProps } from 'preact';
import { cn } from 'cn';

export function Input({ class: className, ...props }: ComponentProps<'input'>) {
  return <input class={cn('mt-2 h-12 w-full rounded-md rule border-border bg-card px-3 py-0 font-mono text-base text-foreground aria-invalid:border-primary', className as string)} {...props} />;
}
