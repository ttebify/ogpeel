import type { ScreenProps } from '@/lib/types';
import { metaLine } from '@/lib/util';
import { NavHead, pad2 } from './parts';

export function AllImages({ s, a }: ScreenProps) {
  const n = s.images.length;
  const busy = !!s.busy;
  return (
    <div class="frame">
      <NavHead a={a} to="popup" host={s.page?.host || ''}>{n} images</NavHead>
      <div class="list">
        {s.images.map((img, i) => {
          const tag = img.tags.join(' + ').toUpperCase();
          return (
            <div class="irow" key={img.url + i}>
              <button class="pick" onClick={() => a.select(i)} aria-label={`Show image ${i + 1}, ${tag}`}>
                <span class="mono n">{pad2(i + 1)}</span>
                {img.broken ? <div class="thumb" /> : <img class="thumb" src={img.url} alt="" />}
                <span class="txt">
                  <span style={{ fontWeight: 500 }}>{tag}</span>
                  <span class="pencil">{img.broken ? "DIDN'T LOAD" : metaLine(img)}</span>
                </span>
              </button>
              {!img.broken && (
                <button class="dl" aria-label={`Download ${tag}`} disabled={busy} onClick={() => a.download(i)}>↓</button>
              )}
            </div>
          );
        })}
      </div>
      <div class="note">Each tag can point to a different size.</div>
      {s.error && <p class="err" role="alert" style={{ marginBottom: '8px' }}>{s.error}</p>}
      <button class="btn hot" disabled={busy} onClick={a.downloadAll}>
        {s.busy === 'download' ? 'SAVING…' : `↓ DOWNLOAD ALL ${n}`}
      </button>
    </div>
  );
}
