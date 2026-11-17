import { Button } from '@/components/ui/button';
import { Frame } from '@/components/ui/frame';
import type { ScreenProps } from '@/lib/types';
import { metaLine } from '@/lib/util';
import { Brand, NavHead } from './parts';

export function SavedScreen({ s, a }: ScreenProps) {
  const saved = s.saved;
  return (
    <Frame>
      <NavHead a={a} to="popup" host={s.page?.host || ''}>
        <Brand />
      </NavHead>
      {saved && (
        <>
          <div class="mt-6 flex items-start gap-4">
            <img
              class="block aspect-share w-30 shrink-0 rule border-foreground bg-foreground object-cover shadow-saved"
              src={saved.image.url}
              alt=""
            />
            <div class="flex flex-col gap-2">
              <span class="font-mono text-xs tracking-label">✓ SAVED</span>
              <span class="text-2xl leading-heading">
                {saved.requested === 1
                  ? 'Image saved'
                  : `${saved.count} of ${saved.requested} images saved`}
              </span>
            </div>
          </div>
          <div class="mt-6 break-all rule-y border-foreground py-3 font-mono text-xs leading-[1.6]">
            {saved.filename}
            <br />
            <span class="text-muted-foreground">
              {metaLine(saved.image)}
              {saved.count > 1 ? ` and ${saved.count - 1} more` : ''}
            </span>
          </div>
        </>
      )}
      <div class="mt-auto flex flex-col gap-3">
        <Button variant="solid" onClick={a.showInFolder}>
          SHOW IN FOLDER
        </Button>
        <Button variant="mono-link" onClick={() => a.go('popup')}>
          BACK TO THE IMAGE
        </Button>
      </div>
    </Frame>
  );
}
