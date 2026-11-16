import type { ScreenProps } from '@/lib/types';
import { NavHead } from './parts';

export function Unlock({ a }: ScreenProps) {
  return (
    <div class="frame">
      <NavHead a={a} to="dev">Free prompts used</NavHead>
      <div class="big" style={{ marginTop: '24px' }}>Unlimited prompts, paid once<span class="dot">.</span></div>
      <p class="body16" style={{ margin: '12px 0 0', fontStyle: 'italic' }}>Everything else in Ogpeel stays free, whatever you choose.</p>
      <div class="facts">
        <div><div class="num">$9</div><div class="mono">ONCE · ALL FRAMEWORKS</div></div>
        <div><div class="num">14</div><div class="mono">DAYS TO ASK FOR A REFUND</div></div>
      </div>
      <div class="push stack8">
        <button class="btn hot" onClick={() => a.openSite('pricing')}>PAY $9 ON OGPEEL.COM ↗</button>
        <button class="btn h44" onClick={() => a.go('key')}>I HAVE A KEY</button>
        <button class="italic-link" onClick={() => a.openSite('coffee')}>Not now — buy me a coffee instead ↗</button>
      </div>
    </div>
  );
}
