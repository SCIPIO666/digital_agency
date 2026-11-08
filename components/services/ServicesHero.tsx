"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MaskedWords } from "@/components/shared/MaskedWords";

/**
 * Piece 1 of 4. One huge heading, then a much smaller description (Huge pattern),
 * in light mode. Words rise out of masks, then the copy fades up.
 * Initial hidden states live in globals.css under prefers-reduced-motion: no-preference.
 */
export function ServicesHero() {
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
      aria-labelledby="services-title"
      className="relative flex min-h-dvh flex-col justify-end px-6 pt-32 pb-28 md:px-10 md:pb-32"
    >
      <div className="mx-auto w-full max-w-page">
        <p data-reveal data-hero-eyebrow className="eyebrow mb-8">
          Services
        </p>

        <h1
          id="services-title"
          className="font-sans text-[clamp(3rem,10.5vw,10rem)] leading-[0.9] font-semibold tracking-[-0.045em] uppercase"
        >
          <MaskedWords text="Everything it takes to get found." highlightLast />
        </h1>

        <p
          data-reveal
          data-hero-copy
          className="mt-10 max-w-2xl font-display text-[clamp(1.125rem,1.7vw,1.625rem)] leading-snug text-body"
        >
          Strategy, design, content, film, software and automation, run by one connected team. Each service stands on
          its own. Together they make you impossible to miss.
        </p>
      </div>

      <div
        data-reveal
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
