"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { StageScenes } from "@/components/home/stage/StageScenes";
import { ACTS, buildStage, type StageHandle } from "@/components/home/stage/timeline";

/**
 * LEFT HALF of the landing page: a six-act looping showreel.
 * See components/home/stage/ for the pieces:
 *   StageScenes.tsx  markup for each act
 *   timeline.ts      the GSAP master timeline (pacing + animation)
 *   public/stage/    optimized stills made from public/media
 */
export function MediaStage() {
  const rootRef = useRef<HTMLElement>(null);
  const handleRef = useRef<StageHandle | null>(null);
  const userPausedRef = useRef(false);

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showHud, setShowHud] = useState(false);

  useEffect(() => {
    setShowHud(new URLSearchParams(window.location.search).has("hud"));
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Reduced motion: no loop. Act 1 stays as a still frame.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const first = root.querySelector<HTMLElement>('[data-scene="see"]');
      if (first) first.style.clipPath = "none";
      gsap.set(root, { opacity: 1 });
      return;
    }

    let ctx: gsap.Context | null = null;

    const build = (resumeAt = 0) => {
      ctx?.revert();
      ctx = gsap.context(() => {
        const handle = buildStage(root);
        handleRef.current = handle;
        handle.master.eventCallback("onUpdate", () => {
          const time = handle.master.time();
          let idx = 0;
          handle.starts.forEach((s, i) => {
            if (time >= s) idx = i;
          });
          setActive((prev) => (prev === idx ? prev : idx));
        });
        handle.master.time(resumeAt);
        if (userPausedRef.current) handle.master.pause();
      }, root);
      gsap.set(root, { opacity: 1 });
    };
    build();

    // Rebuild only when width changes; viewport height changes do not affect the iris origin.
    let timer: number;
    let previousWidth = root.getBoundingClientRect().width;
    const ro = new ResizeObserver(() => {
      const nextWidth = root.getBoundingClientRect().width;
      if (Math.abs(nextWidth - previousWidth) < 8) return;
      previousWidth = nextWidth;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => build(handleRef.current?.master.time() ?? 0), 400);
    });
    ro.observe(root);

    // Stop spending frames while the stage is off-screen (mobile, scrolled to screen two).
    const io = new IntersectionObserver(([entry]) => {
      const m = handleRef.current?.master;
      if (m && !userPausedRef.current) m.paused(!entry.isIntersecting);
    });
    io.observe(root);

    return () => {
      window.clearTimeout(timer);
      ro.disconnect();
      io.disconnect();
      ctx?.revert();
    };
  }, []);

  const jump = (i: number) => {
    const h = handleRef.current;
    if (!h) return;
    h.master.time(h.starts[i] + 0.01);
    if (!userPausedRef.current) h.master.play();
  };

  const togglePause = () => {
    const next = !userPausedRef.current;
    userPausedRef.current = next;
    handleRef.current?.master.paused(next);
    setPaused(next);
  };

  return (
    <section
      ref={rootRef}
      aria-label="Showreel"
      className="group/stage relative min-h-dvh overflow-hidden bg-secondary-100 opacity-0 md:h-full md:min-h-0"
    >
      {/* persistent backdrop, visible while the circle is closed at the loop seam */}
      <div className="bg-glow-lime absolute inset-0" aria-hidden="true" />
      <div className="bg-glow-accent absolute inset-0" aria-hidden="true" />
      <div className="bg-grain absolute inset-0 opacity-50 mix-blend-soft-light" aria-hidden="true" />

      <div aria-hidden="true" className="absolute inset-0">
        <StageScenes />
      </div>
      <div data-iris-ring aria-hidden="true" className="pointer-events-none absolute z-20 rounded-full border-2 border-lime-300 opacity-0 shadow-[0_0_24px_2px_rgba(163,230,53,.45)]" />

      <p className="sr-only">
        A looping showreel: be seen, be trusted, be wanted, be booked. Digital marketing, branding, photography and
        video, design, content, web, software and automation.
      </p>

      {/* Scene controls are useful for reviewing the full loop. */}
      {showHud && (
      <div className="absolute top-5 right-5 z-30 flex max-w-[calc(100%_-_2.5rem)] flex-wrap items-center justify-end gap-2 rounded-full border border-border-strong bg-card/90 px-2 py-1.5 text-[0.625rem] font-bold tracking-nav uppercase shadow-card backdrop-blur md:top-6">
          {ACTS.map((a, i) => (
            <button
              key={a.id}
              type="button"
              onClick={() => jump(i)}
              aria-label={`Jump to ${a.label}`}
              aria-current={active === i}
              className={`rounded-full px-2 py-1 transition-colors ${active === i ? "bg-primary text-on-primary" : "text-muted hover:text-foreground"}`}
            >
              {a.label}
            </button>
          ))}
          <span className="mx-0.5 h-4 w-px bg-border-strong" aria-hidden="true" />
          <button type="button" onClick={togglePause} className="px-1.5 py-1 hover:text-primary">
            {paused ? "Play" : "Pause"}
          </button>
        </div>
      )}
    </section>
  );
}
