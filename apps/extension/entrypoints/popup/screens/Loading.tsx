import type { ScreenProps } from '../../../lib/types';
import { Head } from './parts';

export function Loading({ s }: ScreenProps) {
  return (
    <div class="frame" aria-busy="true">
      <Head s={s} />
      <div class="card" style={{ background: 'transparent' }}>
        <div class="hatch mono ls">READING THE PAGE…</div>
        <div class="skel-bar">
          <div class="skel" style={{ width: '72px' }} />
          <div class="skel" style={{ width: '140px', marginLeft: 'auto' }} />
        </div>
      </div>
      <div class="block">
        <div class="skel line" style={{ width: '85%' }} />
        <div class="skel line" style={{ width: '55%' }} />
      </div>
      <div class="dashed push">↓ DOWNLOAD IMAGE</div>
    </div>
  );
}
