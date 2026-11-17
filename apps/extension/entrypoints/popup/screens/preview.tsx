import { useState } from 'preact/hooks';
import { cn } from 'cn';
import { Frame } from '@/components/ui/frame';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { ScreenProps } from '@/lib/types';
import { NavHead } from './parts';

/** How each app lays out a shared link. `id` is the short label on the tab. */
const TABS = [
  { id: 'X', name: 'X', where: 'In a post', dir: 'column', w: '100%', ratio: '1200 / 630' },
  {
    id: 'IN',
    name: 'LinkedIn',
    where: 'In the feed',
    dir: 'column',
    w: '100%',
    ratio: '1200 / 627',
  },
  {
    id: 'SLACK',
    name: 'Slack',
    where: 'Under a message',
    dir: 'column-reverse',
    w: '60%',
    ratio: '1200 / 630',
  },
  { id: 'WA', name: 'WhatsApp', where: 'In a chat', dir: 'row', w: '96px', ratio: '1 / 1' },
] as const;

export function Preview({ s, a }: ScreenProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('X');
  const look = TABS.find((t) => t.id === tab)!;
  const img = s.images[s.current];
  return (
    <Frame>
      <NavHead a={a} to="popup">
        Link preview
      </NavHead>
      <p class="m-0 mt-3 text-base italic leading-body text-muted-foreground">
        Approximate preview. Apps may show it differently.
      </p>
      <ToggleGroup size="md" class="mt-4 grid-cols-4" role="tablist">
        {TABS.map((t) => (
          <ToggleGroupItem
            key={t.id}
            role="tab"
            aria-selected={t.id === tab}
            aria-label={t.name}
            selected={t.id === tab}
            onClick={() => setTab(t.id)}
          >
            {t.id}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div class="mt-4 flex shrink-0 flex-col gap-2 rule border-border bg-card p-4" role="tabpanel">
        <span class="font-mono text-xs text-muted-foreground">{look.where}</span>
        <div
          class="flex border border-preview-border bg-preview text-preview-foreground"
          style={{
            flexDirection: look.dir,
            alignItems: look.dir === 'column-reverse' ? 'flex-start' : undefined,
          }}
        >
          {img && (
            <img
              class="block shrink-0 bg-preview-foreground object-cover"
              src={img.url}
              alt={img.alt || ''}
              style={{ width: look.w, aspectRatio: look.ratio }}
            />
          )}
          <div class="flex min-w-0 flex-col gap-1 px-3 py-2">
            <span class="font-mono text-xs text-preview-muted-foreground">{s.page?.host}</span>
            <span class="line-clamp-2 text-base font-semibold leading-[1.2]">{s.page?.title}</span>
          </div>
        </div>
      </div>
      <div class="mt-4 min-h-0 flex-auto overflow-y-auto rule-t border-border">
        {s.checks.map((c, i) => (
          <div class="flex gap-3 border-b border-border py-2.5 text-base" key={i}>
            <span
              class={cn('w-4 shrink-0 pt-0.75 font-mono text-xs', !c.ok && 'text-primary')}
              aria-label={c.ok ? 'OK' : 'Warning'}
            >
              {c.ok ? '✓' : '!'}
            </span>
            <span>{c.text}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}
