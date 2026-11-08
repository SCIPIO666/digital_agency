"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsapClient";
import { differently } from "@/lib/company";
import { Cursor } from "@/components/company/Cursor";

/**
 * Piece 4 of 9. "Made differently_": big light heading left, two serif paragraphs
 * bottom-right (Nearform pattern, in our fonts and colours). The underscore blinks.
 * Heading and paragraphs reveal on the way down and rewind on the way up.
 */
export function CompanyDifferently() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const scrollTrigger = { trigger: section, start: "top 70%", toggleActions: "play none none reverse" };

      gsap.fromTo(
        section.querySelectorAll("[data-line]"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.12, scrollTrigger },
      );
      gsap.fromTo(
        section.querySelectorAll("[data-para]"),
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.18, delay: 0.3, scrollTrigger },
      );
      gsap.fromTo(section.querySelector("[data-cursor]"), { opacity: 1 }, { opacity: 0, duration: 0.55, ease: "steps(1)", repeat: -1, yoyo: true });
    });
    return () => mm.revert();
  }, []);

  const [first, second] = differently.heading.split(" ");

  return (
    <section ref={root} aria-labelledby="differently-title" className="px-6 pt-[clamp(5rem,12vw,10rem)] pb-[clamp(6rem,14vw,12rem)] md:px-10">
      <div className="mx-auto grid max-w-page gap-14 lg:min-h-[72svh] lg:grid-cols-2 lg:gap-24">
        <h2
          id="differently-title"
          className="font-sans text-[clamp(3.25rem,9vw,8.5rem)] leading-[0.95] font-normal tracking-[-0.045em]"
        >
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-line className="block">{first}</span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-line className="block">
              {second}
              <Cursor />
            </span>
          </span>
        </h2>

        <div className="flex flex-col justify-end gap-8 font-display text-[clamp(1.125rem,1.55vw,1.4375rem)] leading-[1.5] text-body lg:pb-4">
          {differently.paragraphs.map((p) => (
            <p key={p} data-para className="max-w-xl">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
