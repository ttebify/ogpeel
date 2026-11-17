import { Button } from '@/components/ui/button';
import { Frame } from '@/components/ui/frame';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { FREE_PROMPTS } from '@/lib/config';
import { FRAMEWORK_GROUPS, FRAMEWORKS } from '@/lib/prompt';
import type { ScreenProps } from '@/lib/types';
import { ErrorLine, NavHead } from './parts';

export function Dev({ s, a }: ScreenProps) {
  const current = FRAMEWORKS.find((f) => f.id === s.framework);
  const detected = !s.frameworkPicked && s.page?.framework === s.framework;
  const q = s.frameworkQuery.trim().toLowerCase();
  const groups = FRAMEWORK_GROUPS.map(
    (g) =>
      [g, FRAMEWORKS.filter((f) => f.group === g && f.label.toLowerCase().includes(q))] as const,
  ).filter(([, items]) => items.length);
  return (
    <Frame>
      <NavHead a={a} to="popup">
        Make one like this
      </NavHead>
      <p class="m-0 mt-3 text-base leading-[1.35]">
        A prompt for your coding agent. It builds a share image in this style for every page on your
        site, with your own words and colours.
      </p>
      <div class="mt-4 font-mono text-xs tracking-label">YOUR SITE IS BUILT WITH</div>
      {s.picking ? (
        <>
          <Input
            class="h-10 font-serif"
            type="text"
            aria-label="Search frameworks"
            placeholder="Search"
            autoFocus
            value={s.frameworkQuery}
            onInput={(e) => a.searchFrameworks(e.currentTarget.value)}
          />
          <div class="mt-2 flex h-63 shrink-0 flex-col gap-3 overflow-y-auto rule border-foreground p-3">
            {groups.map(([group, items]) => (
              <div key={group}>
                <div class="font-mono text-xs tracking-label text-muted-foreground">{group}</div>
                <ToggleGroup layout="tiles" size="xs" class="mt-1">
                  {items.map((f) => (
                    <ToggleGroupItem
                      key={f.id}
                      aria-pressed={f.id === s.framework}
                      selected={f.id === s.framework}
                      onClick={() => a.setFramework(f.id)}
                    >
                      {f.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            ))}
            {!groups.length && (
              <p class="m-0 text-base">No match. Pick the closest one, or Plain HTML.</p>
            )}
          </div>
        </>
      ) : (
        <>
          <div class="mt-2 flex shrink-0 items-stretch rule border-foreground">
            <div class="flex h-10 flex-1 items-center gap-2 px-3 font-mono text-xs tracking-label">
              <span class="font-medium">{current?.label}</span>
              {detected && <span class="text-muted-foreground">DETECTED</span>}
            </div>
            <Button variant="segment" aria-expanded={false} onClick={a.openPicker}>
              CHANGE
            </Button>
          </div>
          <div
            class="mt-4 h-34 shrink-0 overflow-y-auto whitespace-pre-wrap rule border-foreground bg-card p-3 font-mono text-xs leading-normal [overflow-wrap:break-word]"
            tabIndex={0}
            aria-label="Prompt"
          >
            {s.prompt}
          </div>
        </>
      )}
      <div class="mt-auto flex shrink-0 flex-col gap-2">
        <ErrorLine s={s} />
        <div class="flex items-center justify-between font-mono text-xs tracking-label">
          {s.license.unlocked ? (
            <span>UNLIMITED PROMPTS</span>
          ) : (
            <>
              <span>
                {s.license.freeLeft} OF {FREE_PROMPTS} FREE PROMPTS LEFT
              </span>
              <Button variant="link" onClick={() => a.go('unlock')}>
                UNLIMITED →
              </Button>
            </>
          )}
        </div>
        <Button variant="solid" disabled={!!s.busy || !s.prompt} onClick={a.copyPrompt}>
          COPY PROMPT
        </Button>
      </div>
    </Frame>
  );
}
