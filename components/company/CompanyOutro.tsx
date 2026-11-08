"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, prefersReducedMotion } from "@/lib/gsapClient";

const PILLARS = [
  { t: "Independent.", d: "No holding company, no layers. The people you meet are the people who do the work." },
  { t: "Small on purpose.", d: "A team sized so every project gets senior attention, from the first call to launch day." },
  { t: "Accountable end to end.", d: "One team owns the brand, the build and the growth, so there is nobody else to point at." },
];

/** "The company" block + the pre-CTA link rows. */
export function CompanyOutro() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.from("[data-pillar]", { opacity: 0, y: 40, duration: 0.9, ease: "power3.out", stagger: 0.14, scrollTrigger: { trigger: "[data-pillars]", start: "top 80%" } });
      }
      // hover: lime fill sweeps up, arrow nudges (gsap, not CSS)
      el.querySelectorAll<HTMLElement>("[data-row]").forEach((row) => {
        const fill = row.querySelector("[data-fill]");
        const arrow = row.querySelector("[data-arrow]");
        const title = row.querySelector("[data-rtitle]");
        const enter = () => { gsap.to(fill, { yPercent: 0, duration: 0.5, ease: "power3.out" }); gsap.to(arrow, { x: 12, rotate: -45, duration: 0.4, ease: "power3.out" }); gsap.to(title, { x: 16, duration: 0.4, ease: "power3.out" }); };
        const leave = () => { gsap.to(fill, { yPercent: 101, duration: 0.5, ease: "power3.inOut" }); gsap.to(arrow, { x: 0, rotate: 0, duration: 0.4, ease: "power3.out" }); gsap.to(title, { x: 0, duration: 0.4, ease: "power3.out" }); };
        gsap.set(fill, { yPercent: 101 });
        row.addEventListener("mouseenter", enter); row.addEventListener("mouseleave", leave);
        row.addEventListener("focusin", enter); row.addEventListener("focusout", leave);
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root}>
      {/* The company */}
      <div className="px-6 py-24 sm:px-10 md:px-14 md:py-36">
        <div className="grid gap-12 lg:grid-cols-[1fr_2.2fr]">
          <div>
            <p className="eyebrow mb-4">The company</p>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.02em]">
              A studio, <span className="italic">not a machine.</span>
            </h2>
          </div>
          <ul data-pillars className="divide-y divide-foreground/15 border-y border-foreground/15">
            {PILLARS.map((p) => (
              <li key={p.t} data-pillar className="grid gap-3 py-8 md:grid-cols-[1fr_1.4fr] md:gap-10">
                <h3 className="font-display text-[clamp(1.6rem,3vw,2.5rem)] font-semibold leading-tight">{p.t}</h3>
                <p className="text-[var(--text-lead)] leading-[1.65] text-muted">{p.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pre-CTA rows */}
      <div className="border-t border-foreground/20">
        <Row eyebrow="About Nuevazen." title="Explore our approach." href="/process" />
        <Row eyebrow="Contact." title="Ready to talk?" href="/contact" />
      </div>
    </section>
  );
}

function Row({ eyebrow, title, href }: { eyebrow: string; title: string; href: string }) {
  return (
    <Link data-row href={href} className="relative block overflow-hidden border-b border-foreground/20 px-6 py-12 sm:px-10 md:px-14 md:py-20">
      <span data-fill aria-hidden className="absolute inset-0 bg-primary-400" />
      <div className="relative flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-3 !text-foreground/70">{eyebrow}</p>
          <p data-rtitle className="font-display text-[clamp(2.25rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.025em]">{title}</p>
        </div>
        <span data-arrow aria-hidden className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none">→</span>
      </div>
    </Link>
  );
}
