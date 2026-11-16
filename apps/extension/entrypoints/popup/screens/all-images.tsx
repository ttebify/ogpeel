import { Button } from '@/components/ui/button';
import { Frame } from '@/components/ui/frame';
import type { ScreenProps } from '@/lib/types';
import { metaLine, tagLine } from '@/lib/util';
import { ErrorLine, NavHead, pad2 } from './parts';

const thumb = 'block h-12 w-22 shrink-0 rule border-border bg-foreground object-cover';

export function AllImages({ s, a }: ScreenProps) {
  const n = s.images.length;
  const busy = !!s.busy;
  return (
    <Frame>
      <NavHead a={a} to="popup" host={s.page?.host || ''}>
        {n} images
      </NavHead>
      <div class="min-h-0 flex-auto overflow-y-auto">
        {s.images.map((img, i) => {
          const tag = tagLine(img);
          return (
            <div class="flex items-center gap-3 rule-b border-border py-3" key={img.url + i}>
              <button
                class="flex min-w-0 flex-1 items-center gap-3 bg-transparent p-0 text-left"
                onClick={() => a.select(i)}
                aria-label={`Show image ${i + 1}, ${tag}`}
              >
                <span class="font-mono text-xs w-4 shrink-0">{pad2(i + 1)}</span>
                {img.broken ? <div class={thumb} /> : <img class={thumb} src={img.url} alt="" />}
                <span class="flex min-w-0 flex-1 flex-col gap-1 font-mono text-xs">
                  <span class="truncate font-medium">{tag}</span>
                  <span class="text-muted-foreground">
                    {img.broken ? "DIDN'T LOAD" : metaLine(img)}
                  </span>
                </span>
              </button>
              {!img.broken && (
                <Button
                  variant="icon-outline"
                  class="font-medium"
                  aria-label={`Download ${tag}`}
                  disabled={busy}
                  onClick={() => a.download(i)}
                >
                  ↓
                </Button>
              )}
            </div>
          );
        })}
        <div class="py-3 text-base italic text-muted-foreground">
          Each tag can point to a different size.
        </div>
      </div>
      <ErrorLine s={s} class="mb-2" />
      <Button variant="action" disabled={busy} onClick={a.downloadAll}>
        {s.busy === 'download' ? 'SAVING…' : `↓ DOWNLOAD ALL ${n}`}
      </Button>
    </Frame>
  );
}
