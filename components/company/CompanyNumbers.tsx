"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapClient";
import { MaskedWords } from "@/components/shared/MaskedWords";
import { stats } from "@/lib/company";

/**
 * Piece 3 of 9. "By numbers": heading left, four white cards right (Huge pattern).
 * Cards rise in and each number counts up as its card arrives. Scrolling back
 * above a card resets it, so the count replays on the way down again.
 * The markup holds the FINAL numbers, so no-JS and reduced-motion show real figures.
 */
export function CompanyNumbers() {
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
          stagger: 0.06,
          scrollTrigger: { trigger: section, start: "top 75%", toggleActions: "play none none reverse" },
        },
      );

      section.querySelectorAll<HTMLElement>("[data-stat]").forEach((card, i) => {
        const num = card.querySelector<HTMLElement>("[data-count]");
        const to = Number(num?.dataset.count ?? 0);
        const counter = { v: 0 };
        let tween: gsap.core.Tween | null = null;

        gsap.set(card, { opacity: 0, y: 60 });
        if (num) num.textContent = "0";

        ScrollTrigger.create({
          trigger: card,
          start: "top 88%",
          onEnter: () => {
            gsap.to(card, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", delay: (i % 2) * 0.1 });
            tween?.kill();
            tween = gsap.to(counter, {
              v: to,
              duration: 1.6,
              ease: "power3.out",
              onUpdate: () => {
                if (num) num.textContent = String(Math.round(counter.v));
              },
            });
          },
          onLeaveBack: () => {
            tween?.kill();
            counter.v = 0;
            if (num) num.textContent = "0";
            gsap.to(card, { opacity: 0, y: 60, duration: 0.4, ease: "power2.in" });
          },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="numbers-title" className="px-6 py-[clamp(5rem,12vw,10rem)] md:px-10">
      <div className="mx-auto grid max-w-page gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <h2
          id="numbers-title"
          className="self-start font-sans text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.9] font-semibold tracking-[-0.045em] uppercase lg:sticky lg:top-32"
        >
          <MaskedWords text="Nuevazen by numbers." />
        </h2>

        <ul className="grid grid-cols-2 gap-3 md:gap-4">
          {stats.map((s) => (
            <li
              key={s.label}
              data-stat
              className="flex min-h-48 flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-card md:min-h-72 md:p-8"
            >
              <p className="font-sans text-[clamp(3.25rem,7vw,6.25rem)] leading-none font-semibold tracking-[-0.05em] tabular-nums">
                <span data-count={s.to}>{s.to}</span>
                {s.suffix}
              </p>
              <p className="max-w-48 font-sans text-[clamp(1rem,1.4vw,1.3125rem)] leading-tight font-semibold tracking-tight">
                {s.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
