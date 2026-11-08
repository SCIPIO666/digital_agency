"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MaskedWords } from "@/components/shared/MaskedWords";
import { contactDetails } from "@/lib/contact";

gsap.registerPlugin(ScrollTrigger);

/**
 * Contact page opening: one huge heading, a much smaller line under it, then the
 * direct-contact details. Same masked-word reveal as the Services hero.
 *
 * Depth: lime glow + grain behind, two outline circles that drift up as you scroll
 * (parallax), and the form section below overlaps this one with a rounded top edge.
 */
export function ContactHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .fromTo(section.querySelectorAll("[data-hero-ring]"), { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.6, stagger: 0.15 }, 0)
          .fromTo(section.querySelector("[data-hero-eyebrow]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 0.1)
          .fromTo(section.querySelectorAll("[data-word]"), { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.08 }, 0.2)
          .fromTo(section.querySelector("[data-hero-copy]"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9 }, 0.85)
          .fromTo(section.querySelectorAll("[data-hero-detail]"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 1.1)
          .fromTo(section.querySelector("[data-hero-cue]"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.4);

        // Rings drift upward at different speeds while the hero scrolls away.
        gsap.utils.toArray<HTMLElement>("[data-hero-drift]", section).forEach((el, i) => {
          gsap.to(el, {
            yPercent: -18 - i * 14,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
          });
        });
      },
      section,
    );
    return () => mm.revert();
  }, []);

  const details = [
    contactDetails.email && { label: "Email", value: contactDetails.email, href: `mailto:${contactDetails.email}` },
    contactDetails.phone && { label: "Phone", value: contactDetails.phone, href: `tel:${contactDetails.phone.replace(/\s/g, "")}` },
    contactDetails.location && { label: "Studio", value: contactDetails.location, href: undefined },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <section
      ref={root}
      aria-labelledby="contact-title"
      className="relative isolate flex min-h-[88dvh] flex-col justify-end overflow-hidden px-6 pt-32 pb-32 md:px-10 md:pb-40"
    >
      {/* backdrop: lime light from the top, violet from the corner, fine grain */}
      <div aria-hidden="true" className="bg-glow-lime absolute inset-0 -z-10" />
      <div aria-hidden="true" className="bg-glow-accent absolute inset-0 -z-10" />
      <div aria-hidden="true" className="bg-grain absolute inset-0 -z-10 opacity-40 mix-blend-soft-light" />

      {/* outline circles echo the menu button; one carries a lime fill for a focal point */}
      <div data-hero-drift aria-hidden="true" className="pointer-events-none absolute -top-[6%] -right-[14%] -z-10 w-[58%] max-w-3xl">
        <div data-hero-ring className="aspect-square rounded-full border border-foreground/15" />
      </div>
      <div data-hero-drift aria-hidden="true" className="pointer-events-none absolute top-[16%] right-[6%] -z-10 w-[26%] max-w-sm">
        <div data-hero-ring className="aspect-square rounded-full bg-primary-400/80 shadow-glow" />
      </div>

      <div className="mx-auto w-full max-w-page">
        <p data-hero-eyebrow className="eyebrow mb-8 !text-primary-800">
          Contact
        </p>

        <h1
          id="contact-title"
          className="font-sans text-[clamp(3rem,10.5vw,10rem)] leading-[0.9] font-semibold tracking-[-0.045em] text-foreground uppercase"
        >
          <MaskedWords text="Ready? Let’s talk." highlightLast />
        </h1>

        <p
          data-hero-copy
          className="mt-10 max-w-2xl font-display text-[clamp(1.125rem,1.7vw,1.625rem)] leading-snug text-body"
        >
          Tell
us
about
your
project
-
what
you're
building,
your
budget,
and
the
scope
of
work.
We'll
review
your
brief
and
schedule
a
discovery
call
with
you
as
soon
as
possible.

        </p>

        {details.length > 0 && (
          <dl className="mt-12 flex flex-wrap gap-4">
            {details.map((d) => (
              <div key={d.label} data-hero-detail className="rounded-2xl border border-border bg-card px-5 py-4 shadow-card">
                <dt className="text-[0.6875rem] font-bold tracking-eyebrow text-body uppercase">{d.label}</dt>
                <dd className="mt-1 font-sans text-lg font-semibold">
                  {d.href ? (
                    <a href={d.href} className="underline decoration-primary-500 decoration-2 underline-offset-4 hover:decoration-foreground">
                      {d.value}
                    </a>
                  ) : (
                    d.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <div
        data-hero-cue
        aria-hidden="true"
        className="absolute right-6 bottom-16 hidden items-center gap-3 text-[0.6875rem] font-bold tracking-eyebrow text-body uppercase md:right-10 md:flex"
      >
        Start the brief
        <span className="block h-px w-12 bg-foreground/40" />
      </div>
    </section>
  );
}
