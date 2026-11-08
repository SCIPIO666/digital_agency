"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/lib/services";
import { teasers } from "@/lib/serviceTeasers";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true }); // stops mobile URL-bar jumps re-measuring the pin

/* ---- Tuning knobs ------------------------------------------------------- */
const SCROLL_PER_CARD = 0.8; // viewport heights of scrolling per card
const ENTRY_ANGLE = 75; // degrees the whole wheel sweeps in from the right as the section arrives
/* ------------------------------------------------------------------------- */

/** Phones scroll natively, so GSAP smoothing on top only adds lag: follow the finger exactly there. */
const SCRUB_DESKTOP = 0.25;
const isTouch = () => typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;

const pad = (n: number) => String(n).padStart(2, "0");

// Keep the Photography & Video teaser visually distinct from its stacked card.
const arcImages: Record<string, string> = {
  "photography-video": "/media/sirisvisual-IcwAKUhNGXs-unsplash.webp",
};

/**
 * Piece 2 of 4. Cards sit on a big circle whose centre is BELOW the screen.
 * Card i is rotated i*step degrees around that centre, so the card at the top
 * is upright and the rest fan out to the right, curving away.
 * Scrolling rotates the whole wheel the other way, rolling the current card
 * off to the left and bringing the next one to the top centre.
 * Fully scrubbed, so it reverses perfectly on scroll up.
 *
 * DOM:  section(stage, pinned) > entry(zero-size, at wheel centre) > wheel > item(rotated) > card
 *   entry = the "ushered in" sweep (before the pin)
 *   wheel = the scroll rotation (during the pin)
 */
export function ServiceArc() {
  const stageRef = useRef<HTMLElement>(null);
  const entryRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const entry = entryRef.current;
    const wheel = wheelRef.current;
    if (!stage || !entry || !wheel) return;

    const items = gsap.utils.toArray<HTMLElement>("[data-arc-item]", wheel);
    const n = items.length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stepDeg = 0;
    let current = -1;
    let windowSize = 3;
    const shown: boolean[] = items.map(() => true);

    // Only the cards near the front are painted. Hidden ones leave the compositor
    // entirely, which is the biggest single saving on phones.
    const cull = (c: number) => {
      items.forEach((el, i) => {
        const on = Math.abs(i - c) <= windowSize;
        if (on !== shown[i]) {
          shown[i] = on;
          el.style.visibility = on ? "visible" : "hidden";
        }
      });
    };

    // Update the "01 / 08 · Kicker" line without re-rendering React.
    const setActive = (i: number) => {
      if (i === current) return;
      current = i;
      if (countRef.current) countRef.current.textContent = `${pad(i + 1)} / ${pad(n)}`;
      if (nameRef.current) nameRef.current.textContent = teasers[services[i].slug]?.kicker ?? "";
    };

    // Responsive geometry. Runs on mount and before every ScrollTrigger refresh (resize).
    const measure = () => {
      const vw = stage.clientWidth;
      const vh = stage.clientHeight;
      const mobile = vw < 768;
      windowSize = mobile ? 2 : 3;

      const w = mobile ? Math.min(vw * 0.62, 300) : Math.min(Math.max(vw * 0.22, 240), 340);
      const h = Math.min(vh * 0.56, w * 1.5);
      const r = mobile ? w * 3 : Math.max(vw * 0.85, w * 3); // wheel radius to the card centre
      const gap = w * 0.06;
      const top = Math.max(vh * 0.22, 144); // top edge of the upright card

      stage.style.setProperty("--arc-w", `${w}px`);
      stage.style.setProperty("--arc-h", `${h}px`);
      stage.style.setProperty("--arc-r", `${r}px`);
      stage.style.setProperty("--arc-oy", `${top + h / 2 + r}px`); // y of the wheel centre

      // Angle between neighbours, measured a little inside the card centre so
      // the inner (bottom) corners of neighbours just kiss instead of overlapping.
      stepDeg = ((w + gap) / (r - h * 0.3)) * (180 / Math.PI);
      items.forEach((el, i) => gsap.set(el, { rotation: i * stepDeg, force3D: true }));
      cull(0);
    };

    measure();
    ScrollTrigger.addEventListener("refreshInit", measure);

    const ctx = gsap.context(() => {
      gsap.set(entry, { autoAlpha: 1 }); // markup hides it until geometry exists

      if (reduce) {
        // No motion: a static, centred fan so every card is visible.
        windowSize = n;
        cull(0);
        gsap.set(wheel, { rotation: -((n - 1) * stepDeg) / 2 });
        setActive(Math.floor((n - 1) / 2));
        return;
      }

      setActive(0);

      // 1) Usher the arc in as the section scrolls into view.
      gsap.fromTo(
        entry,
        { rotation: ENTRY_ANGLE },
        {
          rotation: 0,
          ease: "none",
          scrollTrigger: { trigger: stage, start: "top bottom", end: "top top", scrub: isTouch() ? true : SCRUB_DESKTOP },
        },
      );

      // 2) Pin the stage and roll the wheel, one card per step.
      gsap.fromTo(
        wheel,
        { rotation: 0 },
        {
          rotation: () => -(n - 1) * stepDeg,
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${(n - 1) * window.innerHeight * SCROLL_PER_CARD}`,
            pin: true,
            scrub: isTouch() ? true : SCRUB_DESKTOP,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const c = self.progress * (n - 1);
              setActive(Math.round(c));
              cull(c);
            },
          },
        },
      );
    }, stage);

    // Web fonts shift layout; re-measure once they land.
    let alive = true;
    document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());

    return () => {
      alive = false;
      ScrollTrigger.removeEventListener("refreshInit", measure);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={stageRef}
      aria-label="Service highlights"
      className="relative h-dvh overflow-hidden border-t border-foreground/10 bg-background"
      style={
        {
          // Fallbacks for first paint; measure() overwrites these.
          "--arc-w": "260px",
          "--arc-h": "380px",
          "--arc-r": "800px",
          "--arc-oy": "70%",
        } as React.CSSProperties
      }
    >
      <div className="pointer-events-none absolute inset-x-0 top-20 z-10 flex flex-col items-center gap-2 px-6 text-center md:top-7">
        <p className="eyebrow">One brief. Eight ways in.</p>
        <p className="font-sans text-sm font-semibold uppercase tracking-nav tabular-nums">
          <span ref={countRef}>01 / {pad(services.length)}</span>
          <span aria-hidden="true" className="mx-2 text-border-strong">
            ·
          </span>
          <span ref={nameRef}>{teasers[services[0].slug]?.kicker}</span>
        </p>
      </div>

      <div ref={entryRef} className="absolute left-1/2 opacity-0" style={{ top: "var(--arc-oy)" }}>
        <div ref={wheelRef} className="relative will-change-transform">
          {services.map((s) => {
            const t = teasers[s.slug] ?? { kicker: "", line: s.phrase };
            const image = arcImages[s.slug] ?? s.image;
            return (
              <div key={s.slug} data-arc-item className="absolute top-0 left-0 will-change-transform [backface-visibility:hidden]">
                {/* Full-bleed image card: no service name here, the numbered list below carries those. */}
                <article
                  className="absolute overflow-hidden rounded-2xl bg-ink-900 shadow-[0_8px_20px_-10px_rgba(25,25,20,0.35)] ring-1 ring-foreground/10"
                  style={{
                    width: "var(--arc-w)",
                    height: "var(--arc-h)",
                    left: "calc(var(--arc-w) / -2)",
                    top: "calc(var(--arc-h) / -2 - var(--arc-r))",
                  }}
                >
                  <div className="bg-placeholder absolute inset-0" />
                  {/* /public/services/<slug>.webp first; if it is missing, the fallback image is used. */}
                  <ArcImage primary={`/services/${s.slug}.webp`} fallback={image} />
                  {/* scrim: light at the top for the tag, heavier at the bottom for the copy */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.35)_0%,rgba(9,9,11,0)_30%,rgba(9,9,11,0.15)_50%,rgba(9,9,11,0.82)_100%)]"
                  />
                  {t.kicker && (
                    <span className="absolute top-4 left-4 rounded-full bg-primary-400 px-3 py-1 text-[0.6875rem] font-bold tracking-eyebrow text-foreground uppercase">
                      {t.kicker}
                    </span>
                  )}
                  <p className="absolute inset-x-0 bottom-0 p-5 font-display text-[clamp(1.375rem,2.1vw,1.875rem)] leading-[1.08] text-white">
                    {t.line}
                  </p>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Card picture. A real <img> (decoded off the main thread) instead of a CSS background:
 * the browser can size, decode and cache it properly, which matters with eight of them.
 */
function ArcImage({ primary, fallback }: { primary: string; fallback: string }) {
  const [src, setSrc] = useState<string | null>(primary);
  const ref = useRef<HTMLImageElement>(null);

  // SSR'd images can fail before React attaches onError, so also check once on mount.
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setSrc((cur) => (cur === primary ? fallback : null));
  }, [primary, fallback]);

  if (!src) return null; // both missing: the striped placeholder behind shows instead of a broken-image icon

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt=""
      decoding="async"
      draggable={false}
      onError={() => setSrc(src === primary ? fallback : null)}
      className="absolute inset-0 size-full object-cover"
    />
  );
}
