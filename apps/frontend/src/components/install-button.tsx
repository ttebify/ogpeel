// The page is static, so it renders for Chrome and switches to Edge or Safari once it runs.
import { useEffect, useRef, useState } from 'preact/hooks';
import BrowserIcon, { type Browser } from '@/components/browser-icon';
import { LINKS } from '@/config';

const browsers = [
  { id: 'chrome', label: 'Add to Chrome', href: LINKS.chrome },
  { id: 'edge', label: 'Add to Edge', href: LINKS.edge },
  { id: 'safari', label: 'Get for Safari', href: LINKS.safari },
] as const;

function detect(ua: string): Browser {
  if (/Edg\//.test(ua)) return 'edge';
  if (/Safari\//.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS/.test(ua))
    return 'safari';
  return 'chrome';
}

export default function InstallButton() {
  const [current, setCurrent] = useState<Browser>('chrome');
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    setCurrent(detect(navigator.userAgent));
    const close = (e: MouseEvent) => {
      if (menu.current && !menu.current.contains(e.target as Node)) menu.current.open = false;
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    const details = menu.current;
    if (e.key !== 'Escape' || !details?.open) return;
    details.open = false;
    details.querySelector('summary')!.focus();
  };

  const main = browsers.find((b) => b.id === current)!;

  return (
    <div class="relative inline-flex shadow-offset">
      <a
        href={main.href}
        class="box-border flex min-h-13 items-center gap-3 bg-primary px-6 font-mono text-sm font-medium tracking-label text-primary-foreground uppercase no-underline rule border-border"
      >
        <BrowserIcon browser={main.id} />
        {main.label}
      </a>
      <details ref={menu} class="group" onKeyDown={onKeyDown}>
        <summary
          aria-label="Other browsers"
          class="box-border flex min-h-13 cursor-pointer list-none items-center bg-primary px-4 text-primary-foreground rule-y rule-r border-border [&::-webkit-details-marker]:hidden"
        >
          <svg
            viewBox="0 0 12 12"
            class="size-3 transition-transform group-open:rotate-180"
            aria-hidden="true"
          >
            <path d="M1.5 4l4.5 4.5L10.5 4" fill="none" stroke="currentColor" stroke-width="1.75" />
          </svg>
        </summary>
        <ul class="absolute top-full left-0 z-10 m-0 mt-2 min-w-full list-none bg-card p-0 rule border-border shadow-offset">
          <li class="mono px-4 pt-3 pb-2 text-xs text-muted-foreground">Other browsers</li>
          {browsers
            .filter((b) => b.id !== current)
            .map((b) => (
              <li key={b.id}>
                <a
                  href={b.href}
                  class="flex min-h-12 items-center gap-3 px-4 font-mono text-sm tracking-label uppercase no-underline rule-t border-border hover:bg-muted"
                >
                  <BrowserIcon browser={b.id} />
                  {b.label}
                </a>
              </li>
            ))}
        </ul>
      </details>
    </div>
  );
}
