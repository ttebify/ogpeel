import { Button } from '@/components/ui/button';
import { Frame } from '@/components/ui/frame';
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
    <Frame>
      <NavHead a={a} to="dev">Prompt copied</NavHead>
      <div class="mt-6 font-mono text-xs tracking-label">✓ ON YOUR CLIPBOARD · {fw}</div>
      <div class="mt-2 text-2xl leading-[1.15]">Paste it into your coding agent, in your project.</div>
      <div class="mt-6 rule-t border-foreground">
        {STEPS.map((t, i) => (
          <div class="flex gap-3 border-b border-foreground py-3 text-base" key={i}><span class="pt-0.75 font-mono text-xs">0{i + 1}</span><span>{t}</span></div>
        ))}
      </div>
      <div class="mt-auto flex flex-col gap-2">
        <div class="text-center font-mono text-xs tracking-label">
          {s.license.unlocked ? 'UNLIMITED PROMPTS' : `${left} FREE PROMPT${left === 1 ? '' : 'S'} LEFT`}
        </div>
        <Button onClick={() => a.go('dev')}>DONE</Button>
      </div>
    </Frame>
  );
}
