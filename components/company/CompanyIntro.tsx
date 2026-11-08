"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsapClient";
import { numbers } from "@/lib/company";

/** Banner image + "by numbers" counters + stats-in-a-sentence statement. */
export function CompanyIntro() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // Counters: always end on the real number, even with reduced motion.
      el.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
        const to = Number(node.dataset.count);
        const plain = node.dataset.plain === "true";
        const suffix = node.dataset.suffix ?? "";
        const fmt = (v: number) => (plain ? String(Math.round(v)) : Math.round(v).toLocaleString()) + suffix;
        if (reduce) { node.textContent = fmt(to); return; }
        const o = { v: 0 };
        node.textContent = fmt(0);
        ScrollTrigger.create({
          trigger: node, start: "top 88%", once: true,
          onEnter: () => gsap.to(o, { v: to, duration: 2, ease: "power3.out", onUpdate: () => { node.textContent = fmt(o.v); } }),
        });
      });
      if (reduce) return;

      // Banner: clip reveal + parallax
      gsap.fromTo("[data-banner]", { clipPath: "inset(10% 6% 10% 6% round 28px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none",
        scrollTrigger: { trigger: "[data-banner]", start: "top 90%", end: "top 15%", scrub: true },
      });
      gsap.fromTo("[data-banner-img]", { scale: 1.3, yPercent: -8 }, {
        scale: 1, yPercent: 8, ease: "none",
        scrollTrigger: { trigger: "[data-banner]", start: "top bottom", end: "bottom top", scrub: true },
      });

      // Number cells rise in
      gsap.from("[data-stat]", {
        opacity: 0, y: 50, duration: 0.9, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: "[data-stats]", start: "top 80%" },
      });

      // Statement lines
      gsap.from("[data-line]", {
        opacity: 0, y: 40, duration: 1, ease: "power3.out", stagger: 0.14,
        scrollTrigger: { trigger: "[data-statement]", start: "top 75%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root}>
      {/* Banner */}
      <div data-banner className="relative h-[85svh] w-full overflow-hidden bg-secondary-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-banner-img src="/stage/gallery-team.webp" alt="The Nuevazen team" className="absolute inset-0 size-full object-cover" />
      </div>

      {/* By numbers */}
      <div className="px-6 py-24 sm:px-10 md:px-14 md:py-36">
        <h2 className="mb-12 font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.02em] md:mb-20">
          Nuevazen <span className="italic">by numbers.</span>
        </h2>
        <ul data-stats className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-3">
          {numbers.map((s) => (
            <li key={s.label} data-stat className="border-t border-foreground/20 pt-5">
              <p className="font-display text-[clamp(3.5rem,11vw,10rem)] font-semibold leading-[0.9] tracking-[-0.03em] tabular-nums">
                <span data-count={s.to} data-plain={s.plain ? "true" : "false"} data-suffix={s.suffix ?? ""}>
                  {s.to}
                </span>
              </p>
              <p className="mt-4 max-w-[16rem] text-[var(--text-lead)] leading-snug text-muted">{s.label}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Stats in the description */}
      <div data-statement className="border-t border-foreground/15 px-6 py-24 sm:px-10 md:px-14 md:py-36">
        <div className="grid gap-12 lg:grid-cols-[1fr_2.2fr]">
          <p data-line className="eyebrow">Who we are</p>
          <div>
            <p data-line className="font-display text-[clamp(2rem,4.6vw,4.25rem)] leading-[1.12] tracking-[-0.015em]">
              <Chip>8 disciplines</Chip>, <Chip>7 people</Chip> and <Chip>1 standard</Chip>: work that gets a business found,
              trusted and chosen.
            </p>
            <p data-line className="mt-10 max-w-2xl text-[var(--text-lead)] leading-[1.7] text-muted">
              Most businesses juggle a brand agency, a web developer, a photographer and a marketing freelancer, and
              wonder why nothing quite lines up. We put it all under one roof so the story, the look, the site and the
              growth plan are made together, by people who talk to each other.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-primary-400 px-[0.35em] py-[0.02em] whitespace-nowrap">{children}</span>;
}
