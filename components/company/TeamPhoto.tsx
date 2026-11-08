"use client";

import { useEffect, useRef, useState } from "react";

/** Headshot with a coloured initial tile if the image is missing (so the page never shows a broken icon). */
export function TeamPhoto({ src, alt, bg, initial }: { src: string; alt: string; bg: string; initial: string }) {
  const img = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  // SSR'd images can fail before React attaches onError, so check once on mount too.
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]" style={{ backgroundColor: bg }}>
      {failed ? (
        <span aria-hidden="true" className="absolute inset-0 grid place-items-center font-sans text-8xl font-semibold text-foreground/25">
          {initial}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={img}
          data-photo
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="size-full scale-[1.15] object-cover"
        />
      )}
    </div>
  );
}
