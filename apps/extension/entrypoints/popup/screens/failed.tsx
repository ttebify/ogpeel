import { Button } from '@/components/ui/button';
import { Frame } from '@/components/ui/frame';
import type { ScreenProps } from '@/lib/types';
import { Head } from './parts';

export function Failed({ s, a }: ScreenProps) {
  const img = s.images[0];
  const tag = img ? img.tags.join(' + ').toUpperCase() : '';
  return (
    <Frame>
      <Head s={s} />
      <div class="relative mt-4 aspect-share shrink-0 border-(length:--rule-width) border-solid border-border bg-[linear-gradient(to_top_right,transparent_calc(50%_-_1px),var(--foreground)_50%,transparent_calc(50%_+_1px))]">{tag && <span class="absolute left-2 top-2 bg-primary px-1.5 py-0.5 font-mono text-xs text-primary-foreground">{tag}</span>}</div>
      <div class="flex flex-col gap-2 border-0 border-b-(length:--rule-width) border-solid border-border py-4">
        <span class="text-2xl font-semibold leading-heading">The image didn't load</span>
        <span class="text-base leading-body text-muted-foreground">The page names one, but its link isn't answering right now.</span>
      </div>
      {img && <div class="break-all border-0 border-b-(length:--rule-width) border-solid border-border py-3 font-mono text-xs">{img.url.replace(/^[a-z]+:\/\//i, '')}</div>}
      <div class="mt-auto flex flex-col gap-3">
        {s.error && <p class="m-0 font-mono text-xs text-primary" role="alert">{s.error}</p>}
        <Button variant="solid" disabled={!!s.busy} onClick={a.retry}>↻ TRY AGAIN</Button>
        <Button size="compact" variant={s.copied === 'link' ? 'solid' : 'outline'} disabled={!!s.busy} onClick={a.copyLink}>
          {s.copied === 'link' ? '✓ COPIED' : 'COPY IMAGE LINK'}
        </Button>
      </div>
    </Frame>
  );
}
