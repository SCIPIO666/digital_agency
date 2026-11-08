"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapClient";
import { steps, type Step } from "@/lib/process";

const N = steps.length;
const SCROLL_PER_STEP = 70; // % of viewport height of scroll per step
const SWEEP = 0.85; // seconds for one full 360 degree colour sweep

/**
 * PROCESS STEPS
 *
 * A full-width split screen (content left, big number + title right) that holds
 * still while scrolling. Crossing into a new step triggers a QUICK clock-hand sweep:
 * the next step's colours are revealed by a wedge that rotates 360 degrees around the
 * centre dial (the idea from 7h34.fr). Scroll forward = clockwise, back = anticlockwise.
 *
 * Scroll only decides WHICH step is active; the sweep itself is a timed tween, so it is
 * fast and crisp whatever the scroll speed. Layers stack, the incoming one is clipped
 * by a polygon wedge, and the old one is hidden once the sweep lands.
 * Reduced motion: no pin, no sweep, the six steps are stacked as plain split blocks.
 */
export function ProcessSteps() {
  const root = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const section = root.current;
    if (!section || reduced) return;

    const layers = Array.from(section.querySelectorAll<HTMLElement>("[data-layer]"));
    const hand = section.querySelector<HTMLElement>("[data-hand]")!;
    const arc = section.querySelector<SVGCircleElement>("[data-arc]")!;
    const label = section.querySelector<HTMLElement>("[data-dial-count]")!;

    const ARC_LEN = 2 * Math.PI * 46;
    let current = 0;
    let busy: { tween: gsap.core.Tween; finish: () => void } | null = null;
    let W = section.clientWidth;
    let H = section.clientHeight;

    // Wedge from the centre, from 12 o'clock through `a` degrees (dir = 1 clockwise, -1 anticlockwise).
    const wedge = (a: number, dir: 1 | -1) => {
      const R = Math.hypot(W, H);
      const pts = ["50% 50%"];
      const segs = Math.max(1, Math.ceil(a / 20));
      for (let k = 0; k <= segs; k++) {
        const t = ((a * k) / segs) * (Math.PI / 180) * dir;
        pts.push(`${(50 + ((R * Math.sin(t)) / W) * 100).toFixed(2)}% ${(50 - ((R * Math.cos(t)) / H) * 100).toFixed(2)}%`);
      }
      return `polygon(${pts.join(",")})`;
    };

    const reveal = (layer: HTMLElement) => {
      const items = layer.querySelectorAll("[data-r]");
      gsap.fromTo(
        layer.querySelectorAll("[data-mask]"),
        { yPercent: 105 },
        { yPercent: 0, duration: 0.9, ease: "expo.out", delay: 0.25, stagger: 0.08, overwrite: true },
      );
      gsap.fromTo(items, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", delay: 0.4, stagger: 0.07, overwrite: true });
    };

    const place = (i: number) => {
      layers.forEach((l, k) => {
        l.style.visibility = k === i ? "visible" : "hidden";
        l.style.zIndex = k === i ? "1" : "0";
        l.style.clipPath = "none";
      });
    };

    const goTo = (next: number) => {
      if (next === current) return;
      busy?.finish(); // a fast scroller gets a fast sequence: land the running sweep, start the next
      const dir: 1 | -1 = next > current ? 1 : -1;
      const from = layers[current];
      const to = layers[next];
      const state = { a: 0 };

      to.style.visibility = "visible";
      to.style.zIndex = "2";
      to.style.clipPath = wedge(0.5, dir);
      reveal(to);
      gsap.to(arc, { strokeDashoffset: ARC_LEN * (1 - (next + 1) / N), duration: SWEEP, ease: "power3.inOut", overwrite: true });
      gsap.delayedCall(SWEEP * 0.45, () => { label.textContent = String(next + 1).padStart(2, "0"); });

      const finish = () => {
        tween.kill();
        from.style.visibility = "hidden";
        from.style.zIndex = "0";
        to.style.zIndex = "1";
        to.style.clipPath = "none";
        gsap.set(hand, { rotation: 0 });
        label.textContent = String(next + 1).padStart(2, "0");
        busy = null;
      };
      const tween = gsap.to(state, {
        a: 360, duration: SWEEP, ease: "power3.inOut",
        onUpdate: () => {
          to.style.clipPath = wedge(Math.max(state.a, 0.5), dir);
          gsap.set(hand, { rotation: state.a * dir });
        },
        onComplete: finish,
      });
      busy = { tween, finish };
      current = next;
    };

    const ctx = gsap.context(() => {
      place(0);
      gsap.set(arc, { strokeDasharray: ARC_LEN, strokeDashoffset: ARC_LEN * (1 - 1 / N) });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${(N * SCROLL_PER_STEP) / 100 * window.innerHeight}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: () => { W = section.clientWidth; H = section.clientHeight; },
        onUpdate: (self) => goTo(Math.min(N - 1, Math.floor(self.progress * N))),
      });
    }, section);

    return () => {
      busy?.finish();
      ctx.revert();
    };
  }, [reduced]);

  if (reduced) return <StaticSteps />;

  return (
    <section ref={root} aria-label="Our six steps" className="relative h-svh overflow-hidden bg-foreground">
      {steps.map((s, i) => (
        <StepLayer key={s.n} s={s} first={i === 0} />
      ))}

      {/* The dial: ring + ticks, a progress arc, the sweeping hand and the step count. */}
      <div aria-hidden="true" className="pointer-events-none absolute top-[38%] left-1/2 z-10 size-[clamp(6.5rem,17vw,15rem)] md:top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 rounded-full bg-[#fff7eb] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)]" />
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90">
          {Array.from({ length: 60 }).map((_, k) => {
            const a = (k / 60) * Math.PI * 2;
            const big = k % 5 === 0;
            const r1 = big ? 41 : 43;
            return <line key={k} x1={50 + Math.cos(a) * r1} y1={50 + Math.sin(a) * r1} x2={50 + Math.cos(a) * 46} y2={50 + Math.sin(a) * 46} stroke="#171713" strokeOpacity={big ? 0.7 : 0.25} strokeWidth={big ? 0.9 : 0.5} />;
          })}
          <circle data-arc cx="50" cy="50" r="46" fill="none" stroke="#171713" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <div data-hand className="absolute inset-0">
          <span className="absolute top-0 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#fff7eb] bg-[#171713]" />
        </div>
        <p className="absolute inset-0 grid place-items-center font-sans text-[clamp(1.5rem,3.4vw,3rem)] leading-none font-semibold tracking-[-0.05em] text-[#171713] tabular-nums">
          <span>
            <span data-dial-count>01</span>
            <span className="text-[0.4em] font-medium opacity-50">/{String(N).padStart(2, "0")}</span>
          </span>
        </p>
      </div>
    </section>
  );
}

/** One full split screen: content on the left, big number + title on the right (stacked on phones). */
function StepLayer({ s, first, flow = false }: { s: Step; first?: boolean; flow?: boolean }) {
  return (
    <article
      data-layer
      aria-label={`Step ${s.n}: ${s.title}`}
      className={`${flow ? "relative min-h-svh" : "absolute inset-0"} grid grid-rows-[38%_1fr] md:grid-cols-2 md:grid-rows-1`}
      style={{ visibility: first || flow ? "visible" : "hidden" }}
    >
      {/* right: number + title (first on phones, right on desktop) */}
      <div
        className="relative order-1 flex flex-col justify-end overflow-hidden px-6 pb-[4.25rem] md:order-2 md:justify-center md:px-[clamp(2rem,5vw,6rem)] md:pt-24 md:pb-24 md:pl-[clamp(5rem,11vw,12rem)]"
        style={{ backgroundColor: s.right.bg, color: s.right.fg }}
      >
        <div className="overflow-hidden pb-[0.04em]">
          <p data-mask className="font-sans text-[clamp(6rem,23vw,24rem)] leading-[0.82] font-semibold tracking-[-0.07em] md:text-[clamp(8rem,19vw,22rem)]" style={{ color: s.right.num }}>
            {s.n}
          </p>
        </div>
        <div className="mt-3 overflow-hidden pb-[0.1em] md:mt-6">
          <h2 data-mask className="font-sans text-[clamp(2.25rem,6vw,6rem)] leading-[0.95] font-semibold tracking-[-0.045em] uppercase">
            {s.title}
            <span style={{ color: s.right.num }}>.</span>
          </h2>
        </div>
      </div>

      {/* left: description + services at this stage */}
      <div
        className="order-2 flex flex-col justify-center px-6 pt-[4.75rem] pb-16 md:order-1 md:px-[clamp(2rem,5vw,6rem)] md:py-24 md:pr-[clamp(5rem,11vw,12rem)]"
        style={{ backgroundColor: s.left.bg, color: s.left.fg }}
      >
        <p data-r className="eyebrow !text-current opacity-70">
          Step {s.n} / {String(N).padStart(2, "0")}
        </p>
        <p data-r className="mt-4 max-w-md font-display text-[clamp(1.2rem,2vw,1.9rem)] leading-[1.35]">
          {s.copy}
        </p>
        <div data-r className="mt-7 max-w-md border-t pt-5 md:mt-10" style={{ borderColor: "currentColor", borderTopColor: "color-mix(in srgb, currentColor 30%, transparent)" }}>
          <p className="text-[0.6875rem] font-bold tracking-eyebrow uppercase opacity-70">Services at this stage</p>
          <ul className="mt-3 space-y-2">
            {s.services.map((x) => (
              <li key={x} data-r className="flex items-center gap-3 font-sans text-[clamp(0.9rem,1.1vw,1.05rem)] font-medium">
                <span className="size-2 shrink-0 rounded-full bg-current" />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

/** Reduced motion: the same six split screens, simply stacked. */
function StaticSteps() {
  return (
    <section aria-label="Our six steps">
      {steps.map((s) => (
        <StepLayer key={s.n} s={s} flow />
      ))}
    </section>
  );
}
