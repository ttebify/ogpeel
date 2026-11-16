import type { ScreenProps } from '@/lib/types';
import { metaLine } from '@/lib/util';
import { Brand, NavHead } from './parts';

export function SavedScreen({ s, a }: ScreenProps) {
  const saved = s.saved;
  return (
    <div class="frame">
      <NavHead a={a} to="popup" host={s.page?.host || ''}><Brand /></NavHead>
      {saved && (
        <>
          <div class="saved-top">
            <img class="saved-thumb" src={saved.image.url} alt="" />
            <div class="stack8">
              <span class="mono ls">✓ SAVED</span>
              <span style={{ fontSize: '24px', lineHeight: 1.1 }}>In your Downloads</span>
            </div>
          </div>
          <div class="file">
            {saved.filename}
            <br />
            <span class="pencil">
              {metaLine(saved.image)}
              {saved.count > 1 ? ` and ${saved.count - 1} more` : ''}
            </span>
          </div>
        </>
      )}
      <div class="push stack">
        <button class="btn dark" onClick={a.showInFolder}>SHOW IN FOLDER</button>
        <button class="mono-link" onClick={() => a.go('popup')}>BACK TO THE IMAGE</button>
      </div>
    </div>
  );
}
