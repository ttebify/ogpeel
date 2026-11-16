import type { ScreenProps } from '../../../lib/types';
import { metaLine } from '../../../lib/util';
import { GearIcon, Head } from './parts';

export function Popup({ s, a }: ScreenProps) {
  const img = s.images[s.current];
  if (!img) return null;
  const more = s.images.length - 1;
  const busy = !!s.busy;
  return (
    <div class="frame">
      <Head s={s} />
      <div class="card">
        <img class="shot" src={img.url} alt={img.alt || 'Share image'} />
        <div class="bar">
          <span class="chip" title={img.tags.join(' + ')}>{s.usingLargest ? 'LARGEST IMAGE' : (img.tags[0] || '').toUpperCase() + (img.tags.length > 1 ? ' +' + (img.tags.length - 1) : '')}</span>
          <span>{metaLine(img)}</span>
        </div>
      </div>
      {more > 0 && (
        <button class="row-link" onClick={() => a.go('all')}>
          <span>{more} MORE IMAGE{more === 1 ? '' : 'S'} ON THIS PAGE</span><span>→</span>
        </button>
      )}
      <button class="row-link" onClick={() => a.go('preview')}>
        <span>SEE HOW IT LOOKS WHEN SHARED</span><span>→</span>
      </button>
      <div class="push stack" style={{ paddingTop: '12px' }}>
        {s.error && <p class="err" role="alert">{s.error}</p>}
        <button class="btn hot" disabled={busy} onClick={() => a.download()}>
          {s.busy === 'download' ? 'SAVING…' : '↓ DOWNLOAD IMAGE'}
        </button>
        <div class="seg" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          <button class={s.copied === 'image' ? 'on' : ''} disabled={busy} onClick={a.copyImage}>
            {s.copied === 'image' ? '✓ COPIED' : 'COPY IMAGE'}
          </button>
          <button class={s.copied === 'link' ? 'on' : ''} disabled={busy} onClick={a.copyLink}>
            {s.copied === 'link' ? '✓ COPIED' : 'COPY LINK'}
          </button>
        </div>
        <div class="foot">
          <button class="italic-link" onClick={() => a.go('dev')}>Make one like this for your site →</button>
          <button class="gear" aria-label="Settings" onClick={() => a.go('settings')}><GearIcon /></button>
        </div>
      </div>
    </div>
  );
}
