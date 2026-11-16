import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Frame } from '@/components/ui/frame';
import { browser } from 'wxt/browser';
import type { ScreenProps, Settings } from '@/lib/types';
import { NavHead } from './parts';

type Opt<K extends keyof Settings> = { value: Settings[K]; label: string };

export function SettingsScreen({ s, a }: ScreenProps) {
  function group<K extends keyof Settings>(key: K, label: string, opts: Opt<K>[]) {
    return (
      <div class="flex flex-col gap-2 border-b-(length:--rule-width) border-solid border-foreground py-3" role="group" aria-label={label}>
        <span class="text-base">{label}</span>
        <ToggleGroup variant="settings" style={{ gridTemplateColumns: `repeat(${opts.length}, minmax(0, 1fr))` }}>
          {opts.map((o) => {
            const on = s.settings[key] === o.value;
            return (
              <ToggleGroupItem key={o.label} aria-pressed={on} selected={on} onClick={() => a.setSetting(key, o.value)}>{o.label}</ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>
    );
  }
  return (
    <Frame>
      <NavHead a={a} to="popup">Settings</NavHead>
      {group('naming', 'Name saved files after', [{ value: 'title', label: 'PAGE TITLE' }, { value: 'original', label: 'ORIGINAL' }])}
      {group('look', 'Look', [{ value: 'auto', label: 'AUTO' }, { value: 'day', label: 'DAY' }, { value: 'night', label: 'NIGHT' }])}
      {group('keepSource', 'Keep the page address with each copy', [{ value: true, label: 'ON' }, { value: false, label: 'OFF' }])}
      <div class="flex items-center justify-between border-b-(length:--rule-width) border-solid border-foreground py-3">
        <div class="flex flex-col gap-0.5">
          <span class="text-base">Developer prompts</span>
          <span class="font-mono text-xs text-muted-foreground">{s.license.unlocked ? 'UNLIMITED' : `FREE · ${s.license.freeLeft} OF 2 LEFT`}</span>
        </div>
        {!s.license.unlocked && <Button variant="link" class="h-11 font-mono text-xs tracking-label" onClick={() => a.go('key')}>ENTER KEY →</Button>}
      </div>
      <div class="mt-auto flex flex-col">
        <Button variant="external" onClick={() => a.openSite('coffee')}><span>Buy me a coffee</span><span>↗</span></Button>
        <Button variant="external" onClick={() => a.openSite('key')}><span>Lost your key?</span><span>↗</span></Button>
        <Button variant="external" onClick={() => a.openSite('privacy')}><span>Privacy</span><span>↗</span></Button>
        <span class="mt-2 font-mono text-xs text-muted-foreground">OGPEEL {browser.runtime.getManifest().version}</span>
      </div>
    </Frame>
  );
}
