import { Button } from '@/components/ui/button';
import { Frame } from '@/components/ui/frame';
import type { ScreenProps } from '@/lib/types';
import { Head, Notice } from './parts';

export function Empty({ s, a }: ScreenProps) {
  return (
    <Frame>
      <Head s={s} />
      <div
        class="mt-4 flex aspect-share shrink-0 items-center justify-center rule border-dashed border-border text-display italic text-muted-foreground"
        aria-hidden="true"
      >
        —
      </div>
      {s.restricted ? (
        <Notice title="Ogpeel can't open this page">
          Your browser blocks extensions here. Try a regular web page.
        </Notice>
      ) : (
        <Notice title="No link preview image found">
          This page hasn't chosen an image for shared links.
        </Notice>
      )}
      {!s.restricted && s.page?.hasLargest && (
        <Button class="mt-auto" disabled={!!s.busy} onClick={a.showLargest}>
          TRY LARGEST IMAGE
        </Button>
      )}
    </Frame>
  );
}
