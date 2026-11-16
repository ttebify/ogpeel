import { FRAMEWORKS } from '@/lib/prompt';
import type { ScreenProps } from '@/lib/types';
import { NavHead } from './parts';

export function Dev({ s, a }: ScreenProps) {
  return (
    <div class="frame">
      <NavHead a={a} to="popup">Make one like this</NavHead>
      <p class="lead">A prompt for your coding agent. It builds a share image in this style for every page on your site, with your own words and colours.</p>
      <div class="label">YOUR SITE IS BUILT WITH</div>
      <div class="seg fw" style={{ marginTop: '8px' }}>
        {FRAMEWORKS.map((f) => (
          <button key={f.id} aria-pressed={f.id === s.framework} class={f.id === s.framework ? 'on' : ''} onClick={() => a.setFramework(f.id)}>
            {f.label}
          </button>
        ))}
      </div>
      <div class="prompt" tabIndex={0} aria-label="Prompt">{s.prompt}</div>
      <div class="bottom">
        {s.error && <p class="err" role="alert">{s.error}</p>}
        <div class="line">
          {s.license.unlocked ? (
            <span>UNLIMITED PROMPTS</span>
          ) : (
            <>
              <span>{s.license.freeLeft} OF 2 FREE PROMPTS LEFT</span>
              <button class="link-btn" onClick={() => a.go('unlock')}>UNLIMITED →</button>
            </>
          )}
        </div>
        <button class="btn dark" disabled={!!s.busy || !s.prompt} onClick={a.copyPrompt}>COPY PROMPT</button>
      </div>
    </div>
  );
}
