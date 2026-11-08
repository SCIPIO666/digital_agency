"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsapClient";
import { means } from "@/lib/company";
import { Cursor } from "@/components/company/Cursor";

/**
 * Piece 5 of 9. The dark, pinned "Means ..." section (Nearform pattern).
 * The page holds still while scroll plays one scrubbed timeline:
 *   heading lights up -> top lines arrive -> top rule draws down to a dot ->
 *   bottom rule draws down from a dot -> bottom lines arrive.
 * Scrub = fully reversible, and pin spacing keeps the layout correct either way.
 * Reduced motion: no pin, everything simply visible.
 */
export function CompanyMeans() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const q = gsap.utils.selector(section);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: section, start: "top top", end: "+=170%", pin: true, scrub: 0.6, anticipatePin: 1 },
        })
        .fromTo(q("[data-means-heading]"), { opacity: 0.1 }, { opacity: 1, duration: 1 }, 0)
        .fromTo(q("[data-top-line]"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.4 }, 0.8)
        .fromTo(q("[data-top-rule]"), { scaleY: 0 }, { scaleY: 1, duration: 1, transformOrigin: "top" }, 2.7)
        .fromTo(q("[data-top-dot]"), { scale: 0 }, { scale: 1, duration: 0.25 }, 3.7)
        .fromTo(q("[data-bottom-dot]"), { scale: 0 }, { scale: 1, duration: 0.25 }, 3.9)
        .fromTo(q("[data-bottom-rule]"), { scaleY: 0 }, { scaleY: 1, duration: 1, transformOrigin: "top" }, 4.1)
        .fromTo(q("[data-bottom-line]"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.4 }, 5.1)
        .to({}, { duration: 1 }, 6.7); // hold the finished picture before the pin releases

      gsap.fromTo(q("[data-cursor]"), { opacity: 1 }, { opacity: 0, duration: 0.55, ease: "steps(1)", repeat: -1, yoyo: true });
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="means-title"
      className="relative flex h-svh items-center justify-center overflow-hidden rounded-t-[2rem] bg-foreground px-6 text-background md:rounded-t-[3rem]"
    >
      <div className="relative w-fit max-w-full">
        <h2
          id="means-title"
          data-means-heading
          className="font-sans text-[clamp(2.75rem,8.4vw,8rem)] leading-none font-normal tracking-[-0.045em]"
        >
          {means.heading}
          <Cursor />
        </h2>

        {/* Above the heading: four lines, then a rule dropping to a dot on the heading */}
        <div className="absolute bottom-full left-[4%] flex flex-col items-start pb-3 md:left-[6%] md:pb-5">
          <ul className="space-y-0.5 text-[clamp(0.8125rem,1.45vw,1.25rem)] leading-snug font-light">
            {means.top.map((t) => (
              <li key={t} data-top-line>
                {t}
              </li>
            ))}
          </ul>
          <div className="relative mt-4 h-[9svh] w-px md:h-[11svh]">
            <span data-top-rule className="block size-full bg-current" />
            <span data-top-dot className="absolute -bottom-1 -left-[3px] size-[7px] rounded-full bg-current" />
          </div>
        </div>

        {/* Below the heading: a dot and a rule, then four lines */}
        <div className="absolute top-full left-[48%] flex flex-col items-start pt-3 md:left-[52%] md:pt-5">
          <div className="relative h-[9svh] w-px md:h-[11svh]">
            <span data-bottom-dot className="absolute -top-1 -left-[3px] size-[7px] rounded-full bg-current" />
            <span data-bottom-rule className="block size-full bg-current" />
          </div>
          <ul className="mt-4 space-y-0.5 text-[clamp(0.8125rem,1.45vw,1.25rem)] leading-snug font-light">
            {means.bottom.map((t) => (
              <li key={t} data-bottom-line>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
