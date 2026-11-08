"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * HERO. Solid green panel, one huge word per end of the diagonal
 * (top-left / bottom-right), small supporting line in between.
 * Change the panel colour in one place: HERO_BG.
 */
const HERO_BG = "#d8e4b8";

function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
          <span data-char className="inline-block will-change-transform">
            {ch === " " ? "\u00A0" : ch}
          </span>
        </span>
      ))}
    </>
  );
}

export function CaseStudiesHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set("[data-fade]", { opacity: 1 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from("[data-top] [data-char]", { yPercent: 115, duration: 1.1, stagger: 0.045 }, 0.1)
        .from("[data-bottom] [data-char]", { yPercent: 115, duration: 1.1, stagger: 0.035 }, 0.35)
        .fromTo("[data-fade]", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.9);

      // Words drift apart as you leave the hero. Scrubbed, so fully reversible.
      gsap.to("[data-top]", {
        xPercent: -8, yPercent: -10, ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-bottom]", {
        xPercent: 8, yPercent: 10, ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-ring]", {
        scale: 1.6, rotate: 90, ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="cs-hero-title"
      className="relative flex min-h-svh flex-col justify-between overflow-hidden px-6 pb-10 pt-28 sm:px-10 md:px-14"
      style={{ backgroundColor: HERO_BG, color: "#171713" }}
    >
      {/* Decorative ring: echoes the circular cards further down the page */}
      <div
        data-ring
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#171713]/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[44vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#171713]/10"
      />

      <h1 id="cs-hero-title" className="sr-only">
        Case studies. Proof. Delivered work.
      </h1>

      <div data-top aria-hidden className="relative will-change-transform">
        <p data-fade className="eyebrow mb-4 !text-[#171713]/70 opacity-0 sm:mb-6">
          Case studies
        </p>
        <div className="font-sans text-[clamp(3rem,10.5vw,10rem)] font-semibold leading-[0.9] tracking-[-0.045em] uppercase">
          <Chars text="Proof," />
        </div>
      </div>

      <div className="relative z-10 my-8 flex flex-col gap-6 md:my-0 md:flex-row md:items-end md:justify-between">
        <p data-fade className="max-w-sm text-[var(--text-lead)] leading-[1.7] text-[#171713]/80 opacity-0">
          A look at the work behind the claims: businesses that were hard to find, hard to trust or hard to run, and
          what we did about it.
        </p>
        <a
          data-fade
          href="#selected-work"
          className="group inline-flex items-center gap-3 self-start text-sm font-semibold opacity-0 md:self-auto"
        >
          <span className="grid size-10 place-items-center rounded-full border border-[#171713]/40 transition-transform duration-300 group-hover:translate-y-1">
            ↓
          </span>
          Scroll to explore
        </a>
      </div>

      <div data-bottom aria-hidden className="relative self-end text-right will-change-transform">
        <div className="max-w-[12ch] font-sans text-[clamp(3rem,10.5vw,10rem)] font-semibold leading-[0.9] tracking-[-0.045em] uppercase">
          <Chars text="Delivered work." />
        </div>
      </div>
    </section>
  );
}
