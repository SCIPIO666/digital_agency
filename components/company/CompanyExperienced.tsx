"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsapClient";
import { MaskedWords } from "@/components/shared/MaskedWords";
import { experienced } from "@/lib/company";

/**
 * Piece 6 of 9. "Growth deserves experienced hands": heading top-left, four
 * paragraphs stepping in on the right (Nearform pattern). Plays down, rewinds up.
 */
export function CompanyExperienced() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        section.querySelectorAll("[data-word]"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.05,
          scrollTrigger: { trigger: section, start: "top 72%", toggleActions: "play none none reverse" },
        },
      );
      gsap.utils.toArray<HTMLElement>("[data-para]", section).forEach((p) => {
        gsap.fromTo(
          p,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: p, start: "top 88%", toggleActions: "play none none reverse" },
          },
        );
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="experienced-title" className="px-6 py-[clamp(5rem,12vw,10rem)] md:px-10">
      <div className="mx-auto grid max-w-page gap-14 lg:grid-cols-2 lg:gap-24">
        <h2
          id="experienced-title"
          className="self-start font-sans text-[clamp(2.5rem,5.8vw,5.5rem)] leading-[0.98] font-normal tracking-[-0.04em] lg:sticky lg:top-32"
        >
          <MaskedWords text={experienced.heading} />
        </h2>

        <div className="flex flex-col gap-9 font-display text-[clamp(1.125rem,1.55vw,1.4375rem)] leading-[1.5] text-body lg:pt-[18vh]">
          {experienced.paragraphs.map((p) => (
            <p key={p} data-para className="max-w-xl">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
