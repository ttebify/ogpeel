import { Button } from '@/components/ui/button';
import { Frame } from '@/components/ui/frame';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { ScreenProps } from '@/lib/types';
import { metaLine } from '@/lib/util';
import { ErrorLine, GearIcon, Head } from './parts';

export function Popup({ s, a }: ScreenProps) {
  const img = s.images[s.current];
  if (!img) return null;
  const more = s.images.length - 1;
  const busy = !!s.busy;
  return (
    <Frame>
      <Head s={s} />
      <div class="mt-4 shrink-0 rule border-border bg-card">
        <img class="block max-h-47.5 w-full bg-foreground object-contain" src={img.url} alt={img.alt || 'Share image'} />
        <div class="flex items-center justify-between gap-2 rule-t border-border px-3 py-2 font-mono text-xs">
          <span class="max-w-[60%] truncate bg-foreground px-1.5 py-0.5 text-background" title={img.tags.join(' + ')}>{s.usingLargest ? 'LARGEST IMAGE' : (img.tags[0] || '').toUpperCase() + (img.tags.length > 1 ? ' +' + (img.tags.length - 1) : '')}</span>
          <span>{metaLine(img)}</span>
        </div>
      </div>
      {more > 0 && (
        <Button variant="row" onClick={() => a.go('all')}>
          <span>{more} MORE IMAGE{more === 1 ? '' : 'S'} ON THIS PAGE</span><span>→</span>
        </Button>
      )}
      <Button variant="row" onClick={() => a.go('preview')}>
        <span>SEE HOW IT LOOKS WHEN SHARED</span><span>→</span>
      </Button>
      <div class="mt-auto flex flex-col gap-3 pt-3">
        <ErrorLine s={s} />
        <Button variant="action" disabled={busy} onClick={() => a.download()}>
          {s.busy === 'download' ? 'SAVING…' : '↓ DOWNLOAD IMAGE'}
        </Button>
        <ToggleGroup class="grid-cols-2">
          <ToggleGroupItem selected={s.copied === 'image'} disabled={busy} onClick={a.copyImage}>
            {s.copied === 'image' ? '✓ COPIED' : 'COPY IMAGE'}
          </ToggleGroupItem>
          <ToggleGroupItem selected={s.copied === 'link'} disabled={busy} onClick={a.copyLink}>
            {s.copied === 'link' ? '✓ COPIED' : 'COPY LINK'}
          </ToggleGroupItem>
        </ToggleGroup>
        <div class="flex items-center justify-between rule-t border-border pt-1">
          <Button variant="italic-link" class="w-auto" onClick={() => a.go('dev')}>Make one like this for your site →</Button>
          <Button variant="icon" aria-label="Settings" onClick={() => a.go('settings')}><GearIcon /></Button>
        </div>
      </div>
    </Frame>
  );
}
