import { useState } from 'preact/hooks';
import type { ScreenProps } from '../../../lib/types';
import { NavHead } from './parts';

const TABS = [
  { id: 'X', label: 'X', where: 'In a post', dir: 'column', w: '100%', ratio: '1200 / 630' },
  { id: 'IN', label: 'IN', where: 'In the feed', dir: 'column', w: '100%', ratio: '1200 / 627' },
  { id: 'SLACK', label: 'SLACK', where: 'Under a message', dir: 'column-reverse', w: '60%', ratio: '1200 / 630' },
  { id: 'WA', label: 'WA', where: 'In a chat', dir: 'row', w: '96px', ratio: '1 / 1' },
] as const;
const NAMES = { X: 'X', IN: 'LinkedIn', SLACK: 'Slack', WA: 'WhatsApp' };

export function Preview({ s, a }: ScreenProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('X');
  const look = TABS.find((t) => t.id === tab)!;
  const img = s.images[s.current];
  return (
    <div class="frame">
      <NavHead a={a} to="popup">When shared</NavHead>
      <div class="seg tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={t.id === tab} aria-label={NAMES[t.id]} class={t.id === tab ? 'on' : ''} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div class="pcard" role="tabpanel">
        <span class="mono pencil">{look.where}</span>
        <div class="inner" style={{ flexDirection: look.dir, alignItems: look.dir === 'column-reverse' ? 'flex-start' : undefined }}>
          {img && <img class="pimg" src={img.url} alt={img.alt || ''} style={{ width: look.w, aspectRatio: look.ratio }} />}
          <div class="ptxt">
            <span class="mono">{s.page?.host}</span>
            <span class="ptitle">{s.page?.title}</span>
          </div>
        </div>
      </div>
      <div class="checks">
        {s.checks.map((c, i) => (
          <div class="check" key={i}>
            <span class={`mark${c.ok ? '' : ' bad'}`} aria-label={c.ok ? 'OK' : 'Warning'}>{c.ok ? '✓' : '!'}</span>
            <span>{c.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
