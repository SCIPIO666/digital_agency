"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { reviews, type Review } from "@/lib/reviews";

/**
 * REVIEWS: an endless, cardless canvas of testimonials.
 *
 * - The list is laid out on a tile (COLS x ROWS cells). Each quote's on-screen
 *   position is wrap(base + offset, tile), so one DOM copy per quote shows up
 *   forever in every direction (no duplicates for screen readers).
 * - Motion is one tiny physics model driven by gsap.ticker:
 *     idle   -> slow river drift
 *     wheel / arrow keys -> push the velocity, it glides back to the drift
 *     drag   -> canvas sticks to the pointer; hold still and it stops
 *     release -> throws with the pointer's velocity, then eases back to drift
 *     hover a quote -> the river slows right down so it can be read
 */

const COLS = 6;
const DRIFT = { x: -0.45, y: -0.18 }; // px per 16.7ms frame at rest
const FRICTION = 0.035; // how fast velocity settles back to drift
const MAX_V = 70;
const PALETTE = ["#ffb768", "#ffb9a7", "#d8e4b8", "#c4b5fd", "#d4d2cf", "#ffb768", "#064b50", "#f0440a"];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const wrap = (v: number, len: number) => ((v % len) + len) % len;
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Short quotes are set big, long ones a notch smaller. Returns a fraction of cell width. */
const fontScale = (q: string) => (q.length < 70 ? 0.088 : q.length < 100 ? 0.074 : q.length < 130 ? 0.064 : 0.056);

function dims(W: number, H: number) {
  const cellW = Math.max(340, Math.min(W * 0.34, 520));
  const cellH = Math.max(300, Math.min(H * 0.5, 440));
  const rows = Math.ceil(reviews.length / COLS); // every row is filled, so the tile has no empty band
  return { cellW, cellH, rows, TW: COLS * cellW, TH: rows * cellH };
}

function QuoteBlock({ r, i, width, fontSize }: { r: Review; i: number; width?: number; fontSize: number }) {
  const tint = PALETTE[i % PALETTE.length];
  const mark = "pointer-events-none absolute select-none font-display font-semibold leading-none";
  return (
    <figure
      className="relative m-0"
      style={{ width, paddingTop: fontSize * 1.5, paddingBottom: fontSize * 1.9, paddingLeft: fontSize * 0.5, paddingRight: fontSize * 0.5 }}
    >
      <span aria-hidden className={`${mark} left-0 top-0`} style={{ fontSize: fontSize * 4.6, color: tint, transform: "translate(-12%, -8%)" }}>
        &ldquo;
      </span>
      <blockquote className="relative m-0 font-display leading-[1.12] tracking-[-0.01em]" style={{ fontSize }}>
        {r.quote}
      </blockquote>
      <figcaption className="relative mt-4 text-sm leading-snug">
        <span className="font-semibold">{r.name}</span>
        <span className="text-muted"> · {r.role}</span>
      </figcaption>
      <span aria-hidden className={`${mark} bottom-0 right-0`} style={{ fontSize: fontSize * 4.6, color: tint, transform: "translate(12%, 50%)" }}>
        &rdquo;
      </span>
    </figure>
  );
}

export function ReviewsCanvas() {
  const [reduced, setReduced] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;

    const els = Array.from(stage.querySelectorAll<HTMLElement>("[data-q]"));
    const setX = els.map((el) => gsap.quickSetter(el, "x", "px")) as ((v: number) => void)[];
    const setY = els.map((el) => gsap.quickSetter(el, "y", "px")) as ((v: number) => void)[];
    const setRot = els.map((el) => gsap.quickSetter(el, "rotation", "deg")) as ((v: number) => void)[];
    const hint = stage.querySelector<HTMLElement>("[data-hint]");

    let { cellW, cellH, TW, TH } = dims(stage.clientWidth, stage.clientHeight);
    let base: { x: number; y: number }[] = [];
    const place = () => {
      ({ cellW, cellH, TW, TH } = dims(stage.clientWidth, stage.clientHeight));
      const rand = rng(5);
      base = els.map((_, k) => {
        const col = k % COLS, row = Math.floor(k / COLS);
        return {
          x: col * cellW + (rand() - 0.5) * cellW * 0.12 + cellW * 0.04,
          y: row * cellH + (col % 2) * cellH * 0.3 + (rand() - 0.5) * cellH * 0.16 + cellH * 0.08,
        };
      });
      els.forEach((el, k) => {
        el.style.width = `${cellW * 0.88}px`;
        const q = el.querySelector<HTMLElement>("blockquote");
        if (q) q.style.fontSize = `${cellW * fontScale(reviews[k].quote)}px`;
      });
    };
    place();

    let ox = 0, oy = 0, vx = DRIFT.x, vy = DRIFT.y, drift = 1, tilt = 0;
    let dragging = false, hovering = false, lastX = 0, lastY = 0, lastT = 0, touched = false;

    const render = () => {
      els.forEach((_, k) => {
        setX[k](wrap(base[k].x + ox, TW) - cellW);
        setY[k](wrap(base[k].y + oy, TH) - cellH);
        setRot[k](tilt);
      });
    };

    const interacted = () => {
      if (touched) return;
      touched = true;
      if (hint) gsap.to(hint, { opacity: 0, y: 8, duration: 0.6, ease: "power2.out" });
    };

    const tick = (_t: number, dtMs: number) => {
      const k = Math.min(dtMs, 50) / 16.667;
      if (dragging) {
        vx *= Math.pow(0.8, k); // hold still and the river stops
        vy *= Math.pow(0.8, k);
      } else {
        drift += ((hovering ? 0.12 : 1) - drift) * (1 - Math.pow(0.92, k));
        const ease = 1 - Math.pow(1 - FRICTION, k);
        vx += (DRIFT.x * drift - vx) * ease;
        vy += (DRIFT.y * drift - vy) * ease;
        ox += vx * k;
        oy += vy * k;
      }
      tilt += (clamp(vx * 0.07, -3, 3) - tilt) * (1 - Math.pow(0.88, k));
      render();
    };
    gsap.ticker.add(tick);

    // ----- pointer: drag + throw -----
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-nodrag]")) return; // buttons keep their own clicks
      if (e.button !== 0 && e.pointerType === "mouse") return;
      dragging = true; interacted();
      lastX = e.clientX; lastY = e.clientY; lastT = performance.now();
      try { stage.setPointerCapture(e.pointerId); } catch { /* pointer already gone (touch emulation): drag still works */ }
      stage.dataset.dragging = "true";
    };
    const move = (e: PointerEvent) => {
      hovering = !dragging && !!(e.target as HTMLElement).closest("[data-q]");
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      const frames = Math.max((now - lastT) / 16.667, 0.5);
      ox += dx; oy += dy;
      vx = clamp(vx * 0.4 + (dx / frames) * 0.6, -MAX_V, MAX_V);
      vy = clamp(vy * 0.4 + (dy / frames) * 0.6, -MAX_V, MAX_V);
      lastX = e.clientX; lastY = e.clientY; lastT = now;
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      stage.dataset.dragging = "false";
      try { if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId); } catch { /* browser already released it */ }
    };
    const leave = () => { hovering = false; };

    // ----- wheel / trackpad: push the river -----
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      interacted();
      vx = clamp(vx - e.deltaX * 0.12, -MAX_V, MAX_V);
      vy = clamp(vy - e.deltaY * 0.12, -MAX_V, MAX_V);
    };

    // ----- keyboard -----
    const key = (e: KeyboardEvent) => {
      const push = 22;
      if (e.key === "ArrowLeft") vx += push;
      else if (e.key === "ArrowRight") vx -= push;
      else if (e.key === "ArrowUp") vy += push;
      else if (e.key === "ArrowDown") vy -= push;
      else return;
      e.preventDefault(); interacted();
    };

    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);
    stage.addEventListener("pointerleave", leave);
    stage.addEventListener("lostpointercapture", up);
    stage.addEventListener("wheel", wheel, { passive: false });
    stage.addEventListener("keydown", key);
    const ro = new ResizeObserver(() => { place(); render(); });
    ro.observe(stage);

    // entrance: the river fades in
    const ctx = gsap.context(() => {
      gsap.from("[data-inner]", { opacity: 0, y: 40, duration: 1.1, ease: "power3.out", stagger: { each: 0.04, from: "random" }, delay: 0.1 });
      gsap.from("[data-ui]", { opacity: 0, y: 14, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.5 });
    }, stage);
    render();

    return () => {
      gsap.ticker.remove(tick);
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
      stage.removeEventListener("pointercancel", up);
      stage.removeEventListener("pointerleave", leave);
      stage.removeEventListener("lostpointercapture", up);
      stage.removeEventListener("wheel", wheel);
      stage.removeEventListener("keydown", key);
      ro.disconnect();
      ctx.revert();
    };
  }, [reduced]);

  const skip = () => {
    const target = document.getElementById("reviews-cta");
    if (!target) return;
    const to = target.getBoundingClientRect().top + window.scrollY;
    const o = { y: window.scrollY };
    gsap.to(o, { y: to, duration: 1.1, ease: "power3.inOut", onUpdate: () => window.scrollTo({ top: o.y, behavior: "instant" as ScrollBehavior }) });
  };

  if (reduced) return <ReviewsList />;

  return (
    <section aria-labelledby="reviews-title" className="relative bg-background">
      <div
        ref={stageRef}
        data-lenis-prevent
        tabIndex={0}
        role="region"
        aria-label="Client reviews. Drag, scroll or use the arrow keys to move around."
        className="relative h-svh w-full cursor-grab touch-none select-none overflow-hidden bg-background outline-none data-[dragging=true]:cursor-grabbing"
      >
        {reviews.map((r, i) => (
          <div key={r.id} data-q className="absolute left-0 top-0 will-change-transform" style={{ width: 400 }}>
            <div data-inner>
              <QuoteBlock r={r} i={i} fontSize={26} />
            </div>
          </div>
        ))}

        {/* soft fades so the overlay UI stays readable over passing quotes */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-44 bg-gradient-to-b from-background via-background/85 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-background via-background/85 to-transparent" />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-6 pt-24 sm:px-10 md:px-14 md:pt-28">
          <p data-ui className="eyebrow mb-2">Reviews</p>
          <h1 id="reviews-title" data-ui className="font-display text-[clamp(2.25rem,5.5vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.02em]">
            Word on the <span className="italic">street.</span>
          </h1>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 px-6 pb-6 sm:px-10 md:px-14">
          <p data-hint className="eyebrow pointer-events-none">
            <span data-ui className="inline-block">Drag · scroll · or just watch</span>
          </p>
          <button
            data-ui
            data-nodrag
            type="button"
            onClick={skip}
            className="btn btn-outline cursor-pointer bg-background/80 backdrop-blur"
          >
            Skip to contact <span aria-hidden>↓</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/** Reduced-motion fallback: same quotes, no movement. */
function ReviewsList() {
  return (
    <section aria-labelledby="reviews-title" className="px-6 pb-24 pt-32 sm:px-10 md:px-14">
      <p className="eyebrow mb-2">Reviews</p>
      <h1 id="reviews-title" className="mb-16 font-display text-[clamp(2.25rem,5.5vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.02em]">
        Word on the <span className="italic">street.</span>
      </h1>
      <ul className="grid gap-x-10 gap-y-20 md:grid-cols-2 xl:grid-cols-3">
        {reviews.map((r, i) => (
          <li key={r.id} className="pl-4">
            <QuoteBlock r={r} i={i} fontSize={28} />
          </li>
        ))}
      </ul>
    </section>
  );
}
