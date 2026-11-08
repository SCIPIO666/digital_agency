"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsapClient";

/** Pinned manifesto: words light up one by one as you scroll (scrubbed, reversible). */
const LINES = [
  "Anyone can post now.",
  "Being remembered is harder.",
  "Tools change how things get made.",
  "People decide what deserves to be.",
  "We are human-first, design-led and automation-smart.",
  "Not more noise. Better outcomes.",
  "So we built one team that does it all.",
];

export function CompanyManifesto() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) { gsap.set("[data-w]", { opacity: 1 }); return; }
    const ctx = gsap.context(() => {
      gsap.to("[data-w]", {
        opacity: 1, ease: "none", stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top top", end: "+=240%", pin: true, scrub: 0.6, anticipatePin: 1 },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} aria-label="Our manifesto" className="flex min-h-svh items-center bg-[#171713] px-6 text-[#fff7eb] sm:px-10 md:px-14">
      <p className="mx-auto max-w-6xl font-display text-[clamp(1.9rem,4.6vw,4.5rem)] leading-[1.15] tracking-[-0.015em]">
        {LINES.map((line, li) => (
          <span key={li} className="block pb-[0.35em]">
            {line.split(" ").map((w, wi) => (
              <span key={wi} data-w className="inline-block opacity-[0.14]">{w}{"\u00A0"}</span>
            ))}
          </span>
        ))}
      </p>
    </section>
  );
}
