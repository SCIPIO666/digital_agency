"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsapClient";
import { team } from "@/lib/company";
import { TeamPhoto } from "@/components/company/TeamPhoto";

/**
 * Piece 7 of 9. "Team.": Huge's "Leadership." section. The section pins and the
 * row of members slides sideways as you scroll; a circular arrow fills with progress.
 * Reduced motion: no pin, the row is a normal swipeable strip.
 */
export function CompanyTeam() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const section = root.current;
    const row = track.current;
    const progress = ring.current;
    if (!section || !row || !progress) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const distance = () => Math.max(0, row.scrollWidth - window.innerWidth);
      const circumference = 2 * Math.PI * 22;
      gsap.set(progress, { strokeDasharray: circumference, strokeDashoffset: circumference });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        .to(row, { x: () => -distance() }, 0)
        .to(progress, { strokeDashoffset: 0 }, 0);

      gsap.fromTo(
        section.querySelectorAll("[data-word]"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: section, start: "top 75%", toggleActions: "play none none reverse" } },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="team-title" className="relative flex min-h-svh flex-col justify-center overflow-hidden py-24">
      <div className="mx-auto mb-10 flex w-full max-w-page items-end justify-between px-6 md:mb-14 md:px-10">
        <h2
          id="team-title"
          className="font-sans text-[clamp(3.5rem,12vw,11rem)] leading-[0.9] font-semibold tracking-[-0.05em] uppercase"
        >
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-word className="block">
              Team<span className="text-primary-500">.</span>
            </span>
          </span>
        </h2>
        <svg aria-hidden="true" viewBox="0 0 50 50" className="mb-2 size-12 shrink-0 -rotate-90 md:size-16">
          <circle cx="25" cy="25" r="22" fill="none" stroke="currentColor" strokeOpacity=".15" strokeWidth="2" />
          <circle ref={ring} cx="25" cy="25" r="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="overflow-x-auto motion-safe:overflow-visible">
        <div ref={track} className="flex w-max gap-5 px-6 md:gap-8 md:px-10">
          {team.map((m, i) => (
            <article key={i} className="w-[68vw] shrink-0 sm:w-[40vw] md:w-[24vw] lg:w-[20vw]">
              <TeamPhoto src={m.photo} alt={`${m.name}, ${m.role}`} bg={m.bg} initial={m.name.charAt(0)} />
              <h3 className="mt-4 font-sans text-xl font-semibold tracking-[-0.02em]">
                {m.name}
                <span className="text-primary-500">.</span>
              </h3>
              <p className="font-display text-lg text-muted">{m.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
