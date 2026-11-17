import { Button } from '@/components/ui/button';
import { Frame } from '@/components/ui/frame';
import type { ScreenProps } from '@/lib/types';
import { tagLine } from '@/lib/util';
import { ErrorLine, Head, Notice } from './parts';

export function Failed({ s, a }: ScreenProps) {
  const img = s.images[s.current];
  const tag = img ? tagLine(img) : '';
  const more = s.images.length - 1;
  return (
    <Frame>
      <Head s={s} />
      <div class="relative mt-4 aspect-share shrink-0 rule border-border bg-[linear-gradient(to_top_right,transparent_calc(50%_-_1px),var(--foreground)_50%,transparent_calc(50%_+_1px))]">
        {tag && (
          <span class="absolute left-2 top-2 bg-primary px-1.5 py-0.5 font-mono text-xs text-primary-foreground">
            {tag}
          </span>
        )}
      </div>
      <Notice title="The image didn't load">Try again, or copy the image link.</Notice>
      {img && (
        <div class="break-all rule-b border-border py-3 font-mono text-xs">
          {img.url.replace(/^[a-z]+:\/\//i, '')}
        </div>
      )}
      {more > 0 && (
        <Button variant="row" onClick={() => a.go('all')}>
          <span>
            {more} MORE IMAGE{more === 1 ? '' : 'S'} ON THIS PAGE
          </span>
          <span>→</span>
        </Button>
      )}
      <div class="mt-auto flex flex-col gap-3">
        <ErrorLine s={s} />
        <Button variant="solid" disabled={!!s.busy} onClick={a.retry}>
          ↻ TRY AGAIN
        </Button>
        <Button
          size="compact"
          variant={s.copied === 'link' ? 'solid' : 'outline'}
          disabled={!!s.busy}
          onClick={a.copyLink}
        >
          {s.copied === 'link' ? '✓ COPIED' : 'COPY IMAGE LINK'}
        </Button>
      </div>
    </Frame>
  );
}
