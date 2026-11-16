import { Frame } from '@/components/ui/frame';
import type { ScreenProps } from '@/lib/types';
import { Head } from './parts';

export function Loading({ s }: ScreenProps) {
  return (
    <Frame aria-busy="true">
      <Head s={s} />
      <div class="mt-4 shrink-0 rule border-border bg-transparent">
        <div class="flex aspect-share items-center justify-center bg-[repeating-linear-gradient(135deg,var(--muted)_0_8px,var(--background)_8px_16px)] font-mono text-xs tracking-label">READING THE PAGE…</div>
        <div class="flex h-8.25 items-center gap-2 rule-t border-border px-3">
          <div class="h-3 w-18 bg-foreground opacity-15" />
          <div class="ml-auto h-3 w-35 bg-foreground opacity-15" />
        </div>
      </div>
      <div class="flex flex-col gap-2 rule-b border-border py-4">
        <div class="h-4 w-[85%] bg-foreground opacity-12" />
        <div class="h-4 w-[55%] bg-foreground opacity-12" />
      </div>
      <div class="flex h-12 items-center justify-center rule border-dashed border-border font-mono text-sm tracking-label text-muted-foreground mt-auto">↓ DOWNLOAD IMAGE</div>
    </Frame>
  );
}
