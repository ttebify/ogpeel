import { Button } from '@/components/ui/button';
import { Frame } from '@/components/ui/frame';
import type { ScreenProps } from '@/lib/types';
import { Head, Notice } from './parts';

export function Empty({ s, a }: ScreenProps) {
  return (
    <Frame>
      <Head s={s} />
      <div class="mt-4 flex aspect-share shrink-0 items-center justify-center rule border-dashed border-border text-display italic text-muted-foreground" aria-hidden="true">—</div>
      {s.restricted ? (
        <Notice title="Ogpeel can't read this page">Browsers keep extensions out of pages like this one. Try it on an article.</Notice>
      ) : (
        <Notice title="No share image on this page">It doesn't set an og:image or twitter:image.</Notice>
      )}
      {!s.restricted && s.page?.hasLargest && (
        <Button class="mt-auto" disabled={!!s.busy} onClick={a.showLargest}>SHOW THE LARGEST IMAGE INSTEAD</Button>
      )}
    </Frame>
  );
}
