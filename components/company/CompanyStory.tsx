"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsapClient";
import { timeline, values } from "@/lib/company";

/** Timeline ("Built different since day one") + stacking values cards. */
export function CompanyStory() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Spine draws as you scroll the list
      gsap.fromTo("[data-spine]", { scaleY: 0 }, {
        scaleY: 1, ease: "none", transformOrigin: "top",
        scrollTrigger: { trigger: "[data-tl]", start: "top 70%", end: "bottom 70%", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>("[data-row]").forEach((row) => {
        gsap.from(row, { opacity: 0, y: 60, duration: 1, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 85%" } });
        gsap.from(row.querySelector("[data-dotc]"), { scale: 0, duration: 0.6, ease: "back.out(2)", scrollTrigger: { trigger: row, start: "top 78%" } });
      });

      // Values: each card shrinks back as the next slides over it
      const cards = gsap.utils.toArray<HTMLElement>("[data-vcard]");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card, {
          scale: 0.93, opacity: 0.55, ease: "none",
          scrollTrigger: { trigger: next, start: "top 85%", end: "top 20%", scrub: true },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root}>
      {/* Timeline */}
      <div className="px-6 py-24 sm:px-10 md:px-14 md:py-36">
        <p className="eyebrow mb-4">Our story so far</p>
        <h2 className="max-w-4xl font-display text-[clamp(2.25rem,5.5vw,5rem)] font-semibold leading-[0.98] tracking-[-0.02em]">
          Built different <span className="italic">since day one.</span>
        </h2>
        <p className="mt-6 max-w-xl text-[var(--text-lead)] leading-[1.7] text-muted">
          Design-led, systems-minded and accountable for the result. The way we work has not changed. The reach has.
        </p>

        <ol data-tl className="relative mt-20 md:mt-28">
          <span aria-hidden className="absolute bottom-0 left-[11px] top-0 w-px bg-foreground/15 md:left-1/2" />
          <span data-spine aria-hidden className="absolute bottom-0 left-[11px] top-0 w-px bg-foreground md:left-1/2" />
          {timeline.map((t, i) => (
            <li key={i} data-row className={`relative grid gap-4 pb-20 pl-12 md:grid-cols-2 md:gap-24 md:pl-0 ${i % 2 ? "" : ""}`}>
              <span data-dotc aria-hidden className="absolute left-0 top-2 size-6 rounded-full border-2 border-foreground md:left-1/2 md:-ml-3" style={{ backgroundColor: t.bg }} />
              <div className={i % 2 ? "md:order-2 md:text-left" : "md:text-right"}>
                <p className="font-display text-[clamp(3rem,7vw,6rem)] font-semibold leading-none tracking-[-0.03em]">{t.year}</p>
              </div>
              <div className={i % 2 ? "md:order-1 md:text-right" : ""}>
                <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-tight">{t.title}</h3>
                <p className="mt-2 max-w-md text-muted md:inline-block">{t.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Values */}
      <div className="px-4 pb-32 sm:px-8 md:px-12">
        <div className="px-2 pb-12 sm:px-2 md:pb-20">
          <p className="eyebrow mb-4">Values</p>
          <h2 className="max-w-4xl font-display text-[clamp(2.25rem,5.5vw,5rem)] font-semibold leading-[0.98] tracking-[-0.02em]">
            It matters <span className="italic">how we show up.</span>
          </h2>
        </div>
        {values.map((v, i) => (
          <article
            key={v.n}
            data-vcard
            className="sticky mb-[16svh] flex min-h-[62svh] flex-col justify-between rounded-[28px] p-7 will-change-transform md:p-12"
            style={{ top: 96 + i * 22, backgroundColor: v.bg, color: v.fg }}
          >
            <p className="font-display text-xl font-semibold">{v.n}</p>
            <div>
              <h3 className="font-display text-[clamp(2.5rem,8vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.03em]">{v.title}</h3>
              <p className="mt-6 max-w-xl text-[var(--text-lead)] leading-[1.6] opacity-85">{v.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
