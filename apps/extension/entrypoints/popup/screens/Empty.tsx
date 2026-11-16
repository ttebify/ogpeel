import type { ScreenProps } from '../../../lib/types';
import { Head } from './parts';

export function Empty({ s, a }: ScreenProps) {
  return (
    <div class="frame">
      <Head s={s} />
      <div class="none" aria-hidden="true">—</div>
      <div class="block">
        <span class="h2">{s.restricted ? "Ogpeel can't read this page" : 'No share image on this page'}</span>
        <span class="body16 pencil">
          {s.restricted
            ? 'Browsers keep extensions out of pages like this one. Try it on an article.'
            : "It doesn't set an og:image or twitter:image."}
        </span>
      </div>
      {!s.restricted && s.page?.hasLargest && (
        <button class="btn push" disabled={!!s.busy} onClick={a.showLargest}>SHOW THE LARGEST IMAGE INSTEAD</button>
      )}
    </div>
  );
}
