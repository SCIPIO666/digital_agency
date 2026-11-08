"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsapClient";
import { MaskedWords } from "@/components/shared/MaskedWords";
import { preCta } from "@/lib/company";

/** Piece 9 of 9. Huge-style dark "Built different since day one." block, just before the shared ContactCta. */
export function CompanyPreCta() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const scrollTrigger = { trigger: section, start: "top 70%", toggleActions: "play none none reverse" };
      gsap.fromTo(section.querySelectorAll("[data-word]"), { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.06, scrollTrigger });
      gsap.fromTo(section.querySelectorAll("[data-rise]"), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.12, delay: 0.3, scrollTrigger });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="precta-title" className="px-4 pb-6 md:px-6">
      <div className="mx-auto max-w-page rounded-[2rem] bg-foreground px-6 py-[clamp(4rem,10vw,9rem)] text-background md:rounded-[3rem] md:px-14">
        <h2 id="precta-title" className="max-w-5xl font-sans text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.95] font-semibold tracking-[-0.045em] uppercase">
          <MaskedWords text={preCta.title} highlightLast />
        </h2>
        <p data-rise className="mt-8 max-w-xl font-display text-[clamp(1.25rem,1.8vw,1.625rem)] leading-[1.4] opacity-80">
          {preCta.copy}
        </p>
        <div data-rise className="mt-10 flex flex-wrap gap-3">
          {preCta.links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full border border-background/40 px-6 py-3 font-sans text-sm font-medium tracking-wide transition-colors hover:bg-background hover:text-foreground focus-visible:bg-background focus-visible:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
