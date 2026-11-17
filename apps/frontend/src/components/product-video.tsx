// Nothing loads from YouTube until play is pressed. Without JavaScript the link opens YouTube.
import { useEffect, useRef, useState } from 'preact/hooks';
import { VIDEO } from '@/config';

export default function ProductVideo() {
  const [playing, setPlaying] = useState(false);
  const player = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (playing) player.current?.focus();
  }, [playing]);

  return (
    <figure class="m-0">
      <div class="relative aspect-video bg-foreground rule border-border shadow-block">
        {playing ? (
          <iframe
            ref={player}
            src={`https://www.youtube-nocookie.com/embed/${VIDEO.id}?autoplay=1&rel=0`}
            title="Ogpeel product video"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            class="block size-full"
          />
        ) : (
          <>
            <img
              src="/product-video-poster.jpg"
              width={1280}
              height={720}
              alt=""
              loading="lazy"
              class="block size-full object-cover opacity-90"
            />
            <a
              href={`https://www.youtube.com/watch?v=${VIDEO.id}`}
              onClick={(e) => {
                e.preventDefault();
                setPlaying(true);
              }}
              class="absolute top-1/2 left-1/2 flex min-h-12 -translate-x-1/2 -translate-y-1/2 items-center gap-3.5 bg-foreground px-5 font-mono whitespace-nowrap sm:min-h-16 sm:px-7 text-sm font-medium tracking-label text-background uppercase no-underline rule border-border shadow-[3px_3px_0_var(--background)]"
            >
              <svg viewBox="0 0 16 16" class="size-4 shrink-0" aria-hidden="true">
                <path d="M3 1.5v13l11-6.5z" fill="currentColor" />
              </svg>
              Play the video <span class="sr-only">({VIDEO.length})</span>
            </a>
          </>
        )}
      </div>
      <figcaption class="mono mt-5 flex flex-wrap justify-between gap-x-6 gap-y-2 text-xs">
        <span>Ogpeel · save the picture behind a link</span>
        <span>Loads from YouTube only when you press play</span>
      </figcaption>
    </figure>
  );
}
