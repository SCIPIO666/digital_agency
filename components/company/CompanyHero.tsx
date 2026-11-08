"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsapClient";
import { MaskedWords } from "@/components/shared/MaskedWords";
import { hero } from "@/lib/company";

/**
 * Piece 1 of 9. Huge's company hero: one huge heading, then a much smaller
 * description. Same treatment as the Services hero so the pages feel like one site.
 */
export function CompanyHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .fromTo(section.querySelector("[data-hero-eyebrow]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 })
          .fromTo(section.querySelectorAll("[data-word]"), { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.07 }, 0.1)
          .fromTo(section.querySelector("[data-hero-copy]"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9 }, 0.75)
          .fromTo(section.querySelector("[data-hero-cue]"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.2);
      },
      section,
    );
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="company-title"
      className="relative flex min-h-dvh flex-col justify-end px-6 pt-32 pb-28 md:px-10 md:pb-32"
    >
      <div className="mx-auto w-full max-w-page">
        <p data-hero-eyebrow className="eyebrow mb-8">
          {hero.eyebrow}
        </p>

        <h1
          id="company-title"
          className="font-sans text-[clamp(3.5rem,14vw,13rem)] leading-[0.88] font-semibold tracking-[-0.05em] uppercase"
        >
          <MaskedWords text={hero.title} highlightLast />
        </h1>

        <p
          data-hero-copy
          className="mt-10 max-w-2xl font-display text-[clamp(1.125rem,1.7vw,1.625rem)] leading-snug text-body"
        >
          {hero.copy}
        </p>
      </div>

      <div
        data-hero-cue
        aria-hidden="true"
        className="absolute right-6 bottom-10 hidden items-center gap-3 text-[0.6875rem] font-bold tracking-eyebrow text-muted uppercase md:right-10 md:flex"
      >
        Scroll
        <span className="block h-px w-12 bg-border-strong" />
      </div>
    </section>
  );
}
