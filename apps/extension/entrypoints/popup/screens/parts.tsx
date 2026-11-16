import type { ComponentChildren } from 'preact';
import type { Actions, Route, State } from '../../../lib/types';

export function Brand() {
  return <span class="brand">Ogpeel<span class="dot">.</span></span>;
}

/** Brand header used on the main screens. */
export function Head({ s }: { s: State }) {
  return (
    <div class="head">
      <Brand />
      <span class="host">{s.page?.host}</span>
    </div>
  );
}

/** Header with a back button. */
export function NavHead({ a, to, host, children }: { a: Actions; to: Route; host?: string; children: ComponentChildren }) {
  return (
    <div class="head nav">
      <button class="back" aria-label="Back" onClick={() => a.go(to)}>←</button>
      <span class="title">{children}</span>
      {host !== undefined && <span class="host">{host}</span>}
    </div>
  );
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
