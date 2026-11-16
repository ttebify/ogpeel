import type { ComponentChildren } from 'preact';
import { cn } from 'cn';
import { Button } from '@/components/ui/button';
import type { Actions, Route, State } from '@/lib/types';

/** Every screen's header sits on a double rule. */
const header = 'flex shrink-0 border-b-4 border-double border-border pb-2';

export function Brand() {
  return <span class="text-2xl font-semibold tracking-brand">Ogpeel<span class="text-primary">.</span></span>;
}

function Host({ host }: { host?: string }) {
  return <span class="ml-auto max-w-40 truncate font-mono text-xs">{host}</span>;
}

export function Head({ s }: { s: State }) {
  return (
    <div class={cn(header, 'items-baseline justify-between')}>
      <Brand />
      <Host host={s.page?.host} />
    </div>
  );
}

export function NavHead({ a, to, host, children }: { a: Actions; to: Route; host?: string; children: ComponentChildren }) {
  return (
    <div class={cn(header, 'items-center justify-start gap-3')}>
      <Button variant="icon-outline" aria-label="Back" onClick={() => a.go(to)}>←</Button>
      <span class="text-2xl font-semibold">{children}</span>
      {host !== undefined && <Host host={host} />}
    </div>
  );
}

/** What went wrong, in a heading and a sentence, when there is no image to show. */
export function Notice({ title, children }: { title: string; children: ComponentChildren }) {
  return (
    <div class="flex flex-col gap-2 rule-b border-border py-4">
      <span class="text-2xl font-semibold leading-heading">{title}</span>
      <span class="text-base leading-body text-muted-foreground">{children}</span>
    </div>
  );
}

/** The sentence shown when an action failed. Renders nothing while there is no error. */
export function ErrorLine({ s, class: className }: { s: State; class?: string }) {
  if (!s.error) return null;
  return <p class={cn('m-0 font-mono text-xs text-primary', className)} role="alert">{s.error}</p>;
}

export function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
    </svg>
  );
}

export const pad2 = (n: number) => String(n).padStart(2, '0');
