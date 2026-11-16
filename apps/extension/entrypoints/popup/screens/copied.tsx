import { FRAMEWORKS } from '@/lib/prompt';
import type { ScreenProps } from '@/lib/types';
import { NavHead } from './parts';

const STEPS = [
  "Open your agent in the site's folder.",
  "Paste. It asks for your colours and fonts if it can't find them.",
  'Open one of your pages and click Ogpeel to check the result.',
];

export function Copied({ s, a }: ScreenProps) {
  const fw = FRAMEWORKS.find((f) => f.id === s.framework)?.label || '';
  const left = s.license.freeLeft;
  return (
    <div class="frame">
      <NavHead a={a} to="dev">Prompt copied</NavHead>
      <div class="mono ls" style={{ marginTop: '24px' }}>✓ ON YOUR CLIPBOARD · {fw}</div>
      <div style={{ marginTop: '8px', fontSize: '24px', lineHeight: 1.15 }}>Paste it into your coding agent, in your project.</div>
      <div class="steps">
        {STEPS.map((t, i) => (
          <div class="step" key={i}><span class="mono">0{i + 1}</span><span>{t}</span></div>
        ))}
      </div>
      <div class="push stack8">
        <div class="mono ls" style={{ textAlign: 'center' }}>
          {s.license.unlocked ? 'UNLIMITED PROMPTS' : `${left} FREE PROMPT${left === 1 ? '' : 'S'} LEFT`}
        </div>
        <button class="btn" onClick={() => a.go('dev')}>DONE</button>
      </div>
    </div>
  );
}
