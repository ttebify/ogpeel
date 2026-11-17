import { useState } from 'preact/hooks';
import { Button } from '@/components/ui/button';
import { Frame } from '@/components/ui/frame';
import { Input } from '@/components/ui/input';
import type { ScreenProps } from '@/lib/types';
import { NavHead } from './parts';

export function EnterKey({ s, a }: ScreenProps) {
  const [key, setKey] = useState('');
  const checking = s.busy === 'key';
  const submit = () => {
    if (key.trim() && !s.busy) a.submitKey(key);
  };

  if (s.license.unlocked) {
    return (
      <Frame>
        <NavHead a={a} to="unlock">
          Unlock key
        </NavHead>
        <div class="mt-8 font-mono text-xs tracking-label">✓ UNLOCKED ON THIS BROWSER</div>
        <div class="mt-2 text-display font-semibold leading-none tracking-display">
          Thank you<span class="text-primary">.</span>
        </div>
        <p class="m-0 mt-3 text-base leading-body">Unlimited prompts unlocked.</p>
        <Button variant="solid" class="mt-auto" onClick={() => a.go('dev')}>
          BACK TO MY PROMPT
        </Button>
      </Frame>
    );
  }

  return (
    <Frame>
      <NavHead a={a} to="unlock">
        Unlock key
      </NavHead>
      <p class="m-0 mt-6 text-base leading-body">Your key is in the email you got after paying.</p>
      <label for="k" class="mt-6 font-mono text-xs tracking-label">
        UNLOCK KEY
      </label>
      <Input
        id="k"
        value={key}
        placeholder="Paste your key"
        autocomplete="off"
        spellcheck={false}
        aria-invalid={s.keyError}
        aria-describedby={s.keyError ? 'k-err' : undefined}
        onInput={(e) => {
          setKey(e.currentTarget.value);
          a.clearKeyError();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
      />
      {s.keyError && (
        <div id="k-err" role="alert" class="mt-2 text-base text-primary">
          That key isn't valid. Copy the full key from your email.
        </div>
      )}
      <div class="mt-auto flex flex-col gap-2">
        <Button variant="solid" disabled={!!s.busy} onClick={submit}>
          {checking ? 'CHECKING…' : 'UNLOCK PROMPTS'}
        </Button>
        <Button variant="italic-link" onClick={() => a.openSite('key')}>
          Lost it? Find my key ↗
        </Button>
      </div>
    </Frame>
  );
}
