"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsapClient";
import { MaskedWords } from "@/components/shared/MaskedWords";
import { processHero } from "@/lib/process";

/** Process hero: same treatment as the Company and Services heroes. */
export function ProcessHero() {
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
          .fromTo(section.querySelector("[data-hero-copy]"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9 }, 0.75);
      },
      section,
    );
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="process-title" className="relative flex min-h-[80dvh] flex-col justify-end px-6 pt-32 pb-20 md:px-10">
      <div className="mx-auto w-full max-w-page">
        <p data-hero-eyebrow className="eyebrow mb-8">{processHero.eyebrow}</p>
        <h1 id="process-title" className="font-sans text-[clamp(3.5rem,14vw,13rem)] leading-[0.88] font-semibold tracking-[-0.05em] uppercase">
          <MaskedWords text={processHero.title} highlightLast />
        </h1>
        <p data-hero-copy className="mt-10 max-w-2xl font-display text-[clamp(1.125rem,1.7vw,1.625rem)] leading-snug text-body">
          {processHero.copy}
        </p>
      </div>
    </section>
  );
}
