"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsapClient";

/**
 * Piece 2 of 9. The team banner (/public/stage/gallery-team.webp), the Huge way:
 * a rounded image that opens up from slightly inset to full width as you scroll,
 * with a gentle parallax inside. Scrubbed, so it reverses on scroll up.
 */
export function CompanyBanner() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        section.querySelector("[data-banner]"),
        { scale: 0.88, borderRadius: 56 },
        {
          scale: 1,
          borderRadius: 24,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top 95%", end: "top 20%", scrub: true },
        },
      );
      gsap.fromTo(
        section.querySelector("[data-banner-img]"),
        { yPercent: -7, scale: 1.18 },
        {
          yPercent: 7,
          scale: 1.18,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-label="The Nuevazen team" className="px-3 md:px-5">
      <div
        data-banner
        className="bg-placeholder relative h-[72svh] w-full overflow-hidden rounded-3xl will-change-transform md:h-[90svh]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-banner-img
          src="/stage/gallery-team.webp"
          alt="The Nuevazen team"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
    </section>
  );
}
