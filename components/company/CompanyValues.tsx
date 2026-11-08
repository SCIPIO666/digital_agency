"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsapClient";
import { valuesBlock } from "@/lib/company";

const icons: Record<string, React.ReactNode> = {
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
  cursor: <path d="m5 3 14 7-6 2-2 6L5 3Z" />,
};

/**
 * Piece 8 of 9. "We're not just another digital company.": a dashed rounded
 * container, heading flanked by dotted lines, and four coloured value cards.
 */
export function CompanyValues() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const scrollTrigger = { trigger: section, start: "top 70%", toggleActions: "play none none reverse" };
      gsap.fromTo(section.querySelectorAll("[data-word]"), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.04, scrollTrigger });
      gsap.fromTo(section.querySelectorAll("[data-value-card]"), { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.12, scrollTrigger: { ...scrollTrigger, trigger: section.querySelector("[data-value-grid]"), start: "top 85%" } });
      gsap.fromTo(section.querySelectorAll("[data-badge]"), { scale: 0 }, { scale: 1, duration: 0.6, ease: "back.out(2)", stagger: 0.12, delay: 0.25, scrollTrigger: { ...scrollTrigger, trigger: section.querySelector("[data-value-grid]"), start: "top 85%" } });
    });
    return () => mm.revert();
  }, []);

  const words = valuesBlock.heading.split(" ");

  return (
    <section ref={root} aria-labelledby="values-title" className="px-6 py-[clamp(4rem,10vw,9rem)] md:px-10">
      <div className="mx-auto max-w-page rounded-[2rem] border-2 border-dashed border-border px-5 py-12 md:rounded-[3rem] md:px-12 md:py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <span aria-hidden="true" className="relative grid size-14 place-items-center">
            <span className="absolute inset-0 rounded-full border border-border" />
            <span className="absolute inset-2.5 rounded-full border border-border" />
            <span className="size-2 rounded-full bg-primary-500" />
          </span>
          <h2 id="values-title" className="mt-6 font-sans text-[clamp(2rem,5vw,4.5rem)] leading-[1] font-normal tracking-[-0.04em]">
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-top">
                <span data-word className="inline-block">
                  {w}
                  {i < words.length - 1 ? " " : ""}
                </span>
              </span>
            ))}
          </h2>
          <span aria-hidden="true" className="mt-8 h-14 w-0 border-l-2 border-dotted border-border" />
        </div>

        <div data-value-grid className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {valuesBlock.items.map((v) => (
            <article
              key={v.lead}
              data-value-card
              className="relative rounded-3xl border-2 bg-card p-6 pt-12 shadow-card"
              style={{ borderColor: v.color }}
            >
              <div className="absolute -top-6 left-6">
                <span data-badge className="grid size-12 place-items-center rounded-full text-white" style={{ backgroundColor: v.color }}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {icons[v.icon]}
                  </svg>
                </span>
              </div>
              <h3 className="font-sans text-2xl font-semibold tracking-[-0.03em]">{v.lead}.</h3>
              <p className="mt-3 font-display text-lg leading-[1.45] text-body">{v.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
