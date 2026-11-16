import { Button } from '@/components/ui/button';
import { Frame } from '@/components/ui/frame';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { FREE_PROMPTS } from '@/lib/config';
import { FRAMEWORKS } from '@/lib/prompt';
import type { ScreenProps } from '@/lib/types';
import { ErrorLine, NavHead } from './parts';

export function Dev({ s, a }: ScreenProps) {
  return (
    <Frame>
      <NavHead a={a} to="popup">Make one like this</NavHead>
      <p class="m-0 mt-3 text-base leading-[1.35]">A prompt for your coding agent. It builds a share image in this style for every page on your site, with your own words and colours.</p>
      <div class="mt-4 font-mono text-xs tracking-label">YOUR SITE IS BUILT WITH</div>
      <ToggleGroup layout="grid" size="sm" class="mt-2">
        {FRAMEWORKS.map((f) => (
          <ToggleGroupItem key={f.id} aria-pressed={f.id === s.framework} selected={f.id === s.framework} onClick={() => a.setFramework(f.id)}>
            {f.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div class="mt-4 h-34 shrink-0 overflow-y-auto whitespace-pre-wrap rule border-foreground bg-card p-3 font-mono text-xs leading-normal [overflow-wrap:break-word]" tabIndex={0} aria-label="Prompt">{s.prompt}</div>
      <div class="mt-auto flex shrink-0 flex-col gap-2">
        <ErrorLine s={s} />
        <div class="flex items-center justify-between font-mono text-xs tracking-label">
          {s.license.unlocked ? (
            <span>UNLIMITED PROMPTS</span>
          ) : (
            <>
              <span>{s.license.freeLeft} OF {FREE_PROMPTS} FREE PROMPTS LEFT</span>
              <Button variant="link" onClick={() => a.go('unlock')}>UNLIMITED →</Button>
            </>
          )}
        </div>
        <Button variant="solid" disabled={!!s.busy || !s.prompt} onClick={a.copyPrompt}>COPY PROMPT</Button>
      </div>
    </Frame>
  );
}
