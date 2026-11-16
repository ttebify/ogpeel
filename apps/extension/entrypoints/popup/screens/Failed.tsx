import type { ScreenProps } from '../../../lib/types';
import { Head } from './parts';

export function Failed({ s, a }: ScreenProps) {
  const img = s.images[0];
  const tag = img ? img.tags.join(' + ').toUpperCase() : '';
  return (
    <div class="frame">
      <Head s={s} />
      <div class="broken">{tag && <span class="tag">{tag}</span>}</div>
      <div class="block">
        <span class="h2">The image didn't load</span>
        <span class="body16 pencil">The page names one, but its link isn't answering right now.</span>
      </div>
      {img && <div class="url">{img.url.replace(/^[a-z]+:\/\//i, '')}</div>}
      <div class="push stack">
        {s.error && <p class="err" role="alert">{s.error}</p>}
        <button class="btn dark" disabled={!!s.busy} onClick={a.retry}>↻ TRY AGAIN</button>
        <button class={`btn h44${s.copied === 'link' ? ' dark' : ''}`} disabled={!!s.busy} onClick={a.copyLink}>
          {s.copied === 'link' ? '✓ COPIED' : 'COPY IMAGE LINK'}
        </button>
      </div>
    </div>
  );
}
