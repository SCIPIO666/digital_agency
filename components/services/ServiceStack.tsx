"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { services } from "@/lib/services";
import { MaskedWords } from "@/components/shared/MaskedWords";

gsap.registerPlugin(ScrollTrigger);

/**
 * Piece 3 of 4. Breaker text, then the numbered service cards.
 *
 * Overlap = CSS `position: sticky` with the same `top` on every card, so each
 * new card slides up and covers the previous one exactly, and it reverses for
 * free on scroll up. GSAP adds the finish: as the next card arrives, the
 * previous one shrinks slightly and dims (scrubbed, so also reversible).
 * Do NOT put overflow:hidden on any ancestor of the list; it breaks sticky.
 */
export function ServiceStack() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Breaker reveal (plays on the way down, rewinds on the way up).
      const breaker = el.querySelector<HTMLElement>("[data-breaker]");
      if (breaker) {
        const scrollTrigger = { trigger: breaker, start: "top 80%", toggleActions: "play none none reverse" };
        gsap.fromTo(
          breaker.querySelectorAll("[data-word]"),
          { yPercent: 110 },
          { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.06, scrollTrigger },
        );
        gsap.fromTo(
          breaker.querySelectorAll("[data-reveal]"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", delay: 0.2, scrollTrigger },
        );
      }

      // Previous card recedes while the next one covers it.
      const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]", el);
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const inner = card.querySelector("[data-stack-inner]");
        const shade = card.querySelector("[data-stack-shade]");

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: () => `top ${parseFloat(getComputedStyle(card).top)}px`, // when next reaches the sticky line
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .to(inner, { scale: 0.94, transformOrigin: "50% 0%" }, 0)
          .to(shade, { opacity: 1 }, 0);
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="stack-title">
      <div
        data-breaker
        className="mx-auto max-w-page px-6 pt-[clamp(6rem,16vh,12rem)] pb-16 md:px-10 md:pb-24"
      >
        <p data-reveal className="eyebrow mb-6">
          The full list
        </p>
        <h2 id="stack-title" className="max-w-5xl font-sans text-mega font-semibold uppercase">
          <MaskedWords text="Here’s everything we do." />
        </h2>
        <p data-reveal className="mt-8 max-w-xl font-display text-quote text-body">
         Every service plugs into the others under one Connected team of experts.
        </p>
      </div>

      <ul className="mx-auto max-w-page px-6 pb-[18vh] md:px-10">
        {services.map((s) => (
          <li key={s.slug} data-stack-card className="sticky top-24 mb-6 last:mb-0 md:mb-[14vh]">
            <div
              data-stack-inner
              className="relative flex h-[calc(100dvh-8.5rem)] max-h-[34rem] flex-col gap-5 overflow-hidden rounded-2xl p-6 will-change-transform md:flex-row md:gap-10 md:p-10"
              style={{ backgroundColor: s.bg, color: s.fg }}
            >
              <div className="flex min-h-0 flex-col justify-between md:flex-1">
                <span className="font-sans text-5xl leading-none font-semibold tracking-[-0.05em] tabular-nums md:text-[clamp(4rem,8vw,7rem)]">
                  {s.number}
                </span>

                <div>
                  <h3 className="font-sans text-title leading-none font-semibold tracking-tight uppercase">
                    {s.title}
                  </h3>
                  <p className="mt-4 max-w-md font-display text-quote">{s.description}</p>

                  <ul className="mt-5 hidden flex-wrap gap-2 sm:flex">
                    {s.capabilities.map((c) => (
                      <li
                        key={c}
                        className="rounded-full border border-current/30 px-3 py-1 text-[0.6875rem] font-bold tracking-nav uppercase"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className="group mt-6 inline-flex items-center gap-3 text-xs font-bold tracking-nav uppercase"
                  >
                    Start a project
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1.5">
                      →
                    </span>
                  </Link>
                </div>
              </div>

              <div className="relative min-h-24 flex-1 overflow-hidden rounded-xl md:flex-none md:basis-[42%]">
                <div className="bg-placeholder absolute inset-0" />
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${s.image})` }}
                />
              </div>

              {/* Darkens this card as the next one slides over it (animated by GSAP) */}
              <div
                data-stack-shade
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-black/20 opacity-0"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
