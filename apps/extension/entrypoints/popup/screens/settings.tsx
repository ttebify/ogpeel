import { browser } from 'wxt/browser';
import type { ScreenProps, Settings } from '@/lib/types';
import { NavHead } from './parts';

type Opt<K extends keyof Settings> = { value: Settings[K]; label: string };

export function SettingsScreen({ s, a }: ScreenProps) {
  function group<K extends keyof Settings>(key: K, label: string, opts: Opt<K>[]) {
    return (
      <div class="group" role="group" aria-label={label}>
        <span>{label}</span>
        <div class="seg small h36" style={{ gridTemplateColumns: `repeat(${opts.length}, minmax(0, 1fr))` }}>
          {opts.map((o) => {
            const on = s.settings[key] === o.value;
            return (
              <button key={o.label} aria-pressed={on} class={on ? 'on' : ''} onClick={() => a.setSetting(key, o.value)}>{o.label}</button>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div class="frame">
      <NavHead a={a} to="popup">Settings</NavHead>
      {group('naming', 'Name saved files after', [{ value: 'title', label: 'PAGE TITLE' }, { value: 'original', label: 'ORIGINAL' }])}
      {group('look', 'Look', [{ value: 'auto', label: 'AUTO' }, { value: 'day', label: 'DAY' }, { value: 'night', label: 'NIGHT' }])}
      {group('keepSource', 'Keep the page address with each copy', [{ value: true, label: 'ON' }, { value: false, label: 'OFF' }])}
      <div class="devrow">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '16px' }}>Developer prompts</span>
          <span class="mono pencil">{s.license.unlocked ? 'UNLIMITED' : `FREE · ${s.license.freeLeft} OF 2 LEFT`}</span>
        </div>
        {!s.license.unlocked && <button class="link-btn" onClick={() => a.go('key')}>ENTER KEY →</button>}
      </div>
      <div class="push" style={{ display: 'flex', flexDirection: 'column' }}>
        <button class="ext" onClick={() => a.openSite('coffee')}><span>Buy me a coffee</span><span>↗</span></button>
        <button class="ext" onClick={() => a.openSite('key')}><span>Lost your key?</span><span>↗</span></button>
        <button class="ext" onClick={() => a.openSite('privacy')}><span>Privacy</span><span>↗</span></button>
        <span class="mono pencil" style={{ marginTop: '8px' }}>OGPEEL {browser.runtime.getManifest().version}</span>
      </div>
    </div>
  );
}
