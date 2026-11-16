import { Button } from '@/components/ui/button';
import { Frame } from '@/components/ui/frame';
import type { ScreenProps } from '@/lib/types';
import { Head } from './parts';

export function Empty({ s, a }: ScreenProps) {
  return (
    <Frame>
      <Head s={s} />
      <div class="mt-4 flex aspect-share shrink-0 items-center justify-center border-(length:--rule-width) border-dashed border-border text-display italic text-muted-foreground" aria-hidden="true">—</div>
      <div class="flex flex-col gap-2 border-0 border-b-(length:--rule-width) border-solid border-border py-4">
        <span class="text-2xl font-semibold leading-heading">{s.restricted ? "Ogpeel can't read this page" : 'No share image on this page'}</span>
        <span class="text-base leading-body text-muted-foreground">
          {s.restricted
            ? 'Browsers keep extensions out of pages like this one. Try it on an article.'
            : "It doesn't set an og:image or twitter:image."}
        </span>
      </div>
      {!s.restricted && s.page?.hasLargest && (
        <Button class="mt-auto" disabled={!!s.busy} onClick={a.showLargest}>SHOW THE LARGEST IMAGE INSTEAD</Button>
      )}
    </Frame>
  );
}
