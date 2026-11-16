import { useState } from 'preact/hooks';
import type { ScreenProps } from '@/lib/types';
import { NavHead } from './parts';

export function EnterKey({ s, a }: ScreenProps) {
  const [key, setKey] = useState('');
  const checking = s.busy === 'key';
  const submit = () => { if (key.trim() && !s.busy) a.submitKey(key); };

  if (s.license.unlocked) {
    return (
      <div class="frame">
        <NavHead a={a} to="unlock">Enter your key</NavHead>
        <div class="mono ls" style={{ marginTop: '32px' }}>✓ UNLOCKED ON THIS BROWSER</div>
        <div class="big" style={{ marginTop: '8px' }}>Thank you<span class="dot">.</span></div>
        <p class="body16" style={{ margin: '12px 0 0' }}>Prompts are unlimited now, for every framework.</p>
        <button class="btn dark push" onClick={() => a.go('dev')}>BACK TO MY PROMPT</button>
      </div>
    );
  }

  return (
    <div class="frame">
      <NavHead a={a} to="unlock">Enter your key</NavHead>
      <p class="body16" style={{ margin: '24px 0 0' }}>It's in the email from your payment, and on the page you saw after paying.</p>
      <label for="k" class="keylabel">LICENSE KEY</label>
      <input
        id="k"
        class={`keyin${s.keyError ? ' bad' : ''}`}
        value={key}
        placeholder="Paste your key"
        autocomplete="off"
        spellcheck={false}
        aria-invalid={s.keyError}
        aria-describedby={s.keyError ? 'k-err' : undefined}
        onInput={(e) => { setKey((e.target as HTMLInputElement).value); a.clearKeyError(); }}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
      />
      {s.keyError && (
        <div id="k-err" role="alert" class="keyerr">That key doesn't match. Check for a missing letter, or find it again on ogpeel.com/key.</div>
      )}
      <div class="push stack8">
        <button class="btn dark" disabled={!!s.busy} onClick={submit}>{checking ? 'CHECKING…' : 'UNLOCK'}</button>
        <button class="italic-link" onClick={() => a.openSite('key')}>Lost it? Find my key ↗</button>
      </div>
    </div>
  );
}
