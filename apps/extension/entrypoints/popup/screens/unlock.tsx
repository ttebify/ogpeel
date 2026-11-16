import { PRICE, REFUND_DAYS } from '@ogpeel/pricing';
import { Button } from '@/components/ui/button';
import { Frame } from '@/components/ui/frame';
import type { ScreenProps } from '@/lib/types';
import { NavHead } from './parts';

export function Unlock({ a }: ScreenProps) {
  return (
    <Frame>
      <NavHead a={a} to="dev">
        Free prompts used
      </NavHead>
      <div class="mt-6 text-display font-semibold leading-none tracking-display">
        Unlimited prompts, paid once<span class="text-primary">.</span>
      </div>
      <p class="m-0 mt-3 text-base italic leading-body">
        Everything else in Ogpeel stays free, whatever you choose.
      </p>
      <div class="mt-4 grid grid-cols-2 rule-y border-foreground">
        <div class="py-3 pr-3">
          <div class="text-display font-semibold leading-none">{PRICE}</div>
          <div class="mt-1 font-mono text-xs">ONCE · ALL FRAMEWORKS</div>
        </div>
        <div class="border-l border-foreground py-3 pl-3">
          <div class="text-display font-semibold leading-none">{REFUND_DAYS}</div>
          <div class="mt-1 font-mono text-xs">DAYS TO ASK FOR A REFUND</div>
        </div>
      </div>
      <div class="mt-auto flex flex-col gap-2">
        <Button variant="action" onClick={() => a.openSite('pricing')}>
          PAY {PRICE} ON OGPEEL.COM ↗
        </Button>
        <Button size="compact" onClick={() => a.go('key')}>
          I HAVE A KEY
        </Button>
        <Button variant="italic-link" onClick={() => a.openSite('coffee')}>
          Not now — buy me a coffee instead ↗
        </Button>
      </div>
    </Frame>
  );
}
