"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MaskedWords } from "@/components/shared/MaskedWords";

gsap.registerPlugin(ScrollTrigger);

type ContactCtaProps = {
  eyebrow?: string;
  title?: string;
  copy?: string;
  label?: string;
  href?: string;
};

/**
 * Piece 4 of 4. The closing call to action, shared by every page so it stays uniform:
 * "we want to start conversations", leading to /contact.
 *
 * Motion: heading words rise out of masks, the copy and button follow (plays on the
 * way down, rewinds on the way up). Two outline circles drift behind, scrubbed to
 * scroll, echoing the circle menu. Reduced motion: everything is simply visible.
 *
 * Do not render this on /contact itself.
 */
export function ContactCta({
  eyebrow = "Contact",
  title = "Let’s start a conversation.",
  copy = "Tell us where you want to be found. We’ll show you how to get there.",
  label = "Contact us",
  href = "/contact",
}: ContactCtaProps) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const scrollTrigger = { trigger: section, start: "top 65%", toggleActions: "play none none reverse" };

        gsap
          .timeline({ defaults: { ease: "expo.out" }, scrollTrigger })
          .fromTo(section.querySelector("[data-cta-eyebrow]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 })
          .fromTo(section.querySelectorAll("[data-word]"), { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.07 }, 0.1)
          .fromTo(section.querySelector("[data-cta-copy]"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9 }, 0.6)
          .fromTo(
            section.querySelector("[data-cta-button]"),
            { opacity: 0, y: 24, scale: 0.92 },
            { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "back.out(1.5)" },
            0.8,
          );

        // Decorative rings: slow scrubbed drift, fully reversible.
        gsap.fromTo(
          section.querySelectorAll("[data-cta-ring]"),
          { scale: 0.75, yPercent: 8 },
          {
            scale: 1.05,
            yPercent: -6,
            ease: "none",
            stagger: 0.15,
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom bottom", scrub: true },
          },
        );
      },
      section,
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="cta-title" className="px-3 pb-3 mt-8 md:px-5 md:pb-5">
      <div className="relative isolate overflow-hidden rounded-3xl bg-primary-400 px-6 pt-24 pb-44 text-foreground md:px-10 md:pt-32 md:pb-52">
        {/* decorative rings, behind the copy */}
        <div
          data-cta-ring
          aria-hidden="true"
          className="pointer-events-none absolute -right-[18%] -bottom-[60%] -z-10 aspect-square w-[75%] rounded-full border border-foreground/15"
        />
        <div
          data-cta-ring
          aria-hidden="true"
          className="pointer-events-none absolute -right-[4%] -bottom-[42%] -z-10 aspect-square w-[50%] rounded-full border border-foreground/15"
        />

        <div className="mx-auto max-w-page">
          <p data-cta-eyebrow className="text-[0.6875rem] font-bold tracking-eyebrow uppercase">
            {eyebrow}
          </p>

          <h2
            id="cta-title"
            className="mt-6 max-w-5xl font-sans text-[clamp(3rem,9vw,8.5rem)] leading-[0.9] font-semibold tracking-[-0.045em] uppercase"
          >
            <MaskedWords text={title} />
          </h2>

          <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
            <p data-cta-copy className="max-w-md font-display text-[clamp(1.125rem,1.6vw,1.5rem)] leading-snug">
              {copy}
            </p>

            <Link
              data-cta-button
              href={href}
              className="group inline-flex w-fit items-center gap-5 rounded-full bg-foreground py-3 pr-3 pl-8 text-xs font-bold tracking-nav text-card uppercase transition-colors duration-300 hover:bg-ink-800 focus-visible:outline-foreground md:text-sm"
            >
              {label}
              <span
                aria-hidden="true"
                className="grid size-11 place-items-center rounded-full bg-primary-400 text-lg text-foreground transition-transform duration-500 ease-out-expo group-hover:-rotate-45 md:size-12"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
