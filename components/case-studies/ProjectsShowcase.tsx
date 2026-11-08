"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { showcaseItems as items, type ShowcaseItem } from "@/lib/caseStudies";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * PROJECTS SHOWCASE
 *
 * One pinned screen. Scroll progress p (0..1) is the ONLY input; every card's
 * position is a pure function of p, so the whole thing is reversible, resize-safe
 * and has no timeline state to get out of sync.
 *
 *   A  title + SVG curve start tracing, coins drop in one by one, stacked on the x axis
 *   B  hold the stack
 *   E  the stack folds straight into: circle | big rectangle | circle   (no random scatter)
 *   F  carousel: the centre card changes project by project, each change eased so a
 *      card rests on its project and then glides to the next
 *   G  short hold on the last project before the pin releases
 *
 * Smoothness: Lenis already smooths the scroll, so we do NOT stack a second tween on
 * top. One ticker callback eases toward the scroll target and writes styles directly
 * (no per-frame gsap.set), and only touches the DOM when a value actually changed.
 *
 * Phase lengths below are in "screens" (vh) of scroll. Tweak freely.
 */
const N = items.length;
const UNITS = { A: 60, B: 20, E: 80, F: (N - 1) * 65, G: 35 } as const;
type Phase = keyof typeof UNITS;
const TOTAL = Object.values(UNITS).reduce((a, b) => a + b, 0);
const T = (() => {
  let acc = 0;
  const out = {} as Record<Phase, [number, number]>;
  (Object.keys(UNITS) as Phase[]).forEach((k) => {
    out[k] = [acc / TOTAL, (acc + UNITS[k]) / TOTAL];
    acc += UNITS[k];
  });
  return out;
})();

/* ---------- tiny math kit ---------- */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const outBack = (t: number) => {
  const c1 = 1.4, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
/** 0..1 progress of p across [start, start + len] */
const ph = (p: number, start: number, len: number) => clamp((p - start) / len);
/** Carousel index with a short rest on every project: eases each change in and out. */
const dwell = (c: number) => {
  const f = Math.floor(c);
  return f + smoother(clamp((c - f - 0.12) / 0.76));
};

/* ---------- layout (recomputed on every ScrollTrigger refresh) ---------- */
type Pose = { x: number; y: number; w: number; h: number; r: number; rot: number; o: number; s: number; detail: number; z: number };
type Layout = {
  W: number; H: number; mobile: boolean;
  coin: number; step: number; d: number; rw: number; rh: number; sideX: number;
  curve: string;
};
const RECT_RADIUS = 28;

function layout(W: number, H: number): Layout {
  const mobile = W < 768;
  const coin = mobile ? Math.min(W * 0.34, H * 0.22) : Math.min(H * 0.34, W * 0.17);
  const step = Math.min(coin * 0.5, (W * 0.9 - coin) / (N - 1));
  const rw = mobile ? W * 0.7 : Math.min(W * 0.32, 460);
  const rh = mobile ? H * 0.62 : Math.min(H * 0.8, 620);
  const d = mobile ? Math.min(W * 0.46, H * 0.3) : Math.min(H * 0.46, W * 0.24);
  const sideX = mobile ? rw / 2 + d * 0.25 : rw / 2 + d / 2 + W * 0.04;

  const curve =
    `M ${-0.02 * W} ${0.82 * H} ` +
    `C ${0.18 * W} ${0.95 * H}, ${0.2 * W} ${0.25 * H}, ${0.38 * W} ${0.34 * H} ` +
    `S ${0.55 * W} ${0.9 * H}, ${0.72 * W} ${0.62 * H} ` +
    `S ${0.9 * W} ${0.12 * H}, ${1.03 * W} ${0.3 * H}`;

  return { W, H, mobile, coin, step, d, rw, rh, sideX, curve };
}

/* ---------- poses ---------- */
const mixPose = (a: Pose, b: Pose, t: number): Pose => ({
  x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), w: mix(a.w, b.w, t), h: mix(a.h, b.h, t),
  r: mix(a.r, b.r, t), rot: mix(a.rot, b.rot, t), o: mix(a.o, b.o, t), s: mix(a.s, b.s, t),
  detail: mix(a.detail, b.detail, t), z: b.z,
});

function stackPose(i: number, L: Layout): Pose {
  return { x: (i - (N - 1) / 2) * L.step, y: 0, w: L.coin, h: L.coin, r: L.coin / 2, rot: 0, o: 1, s: 1, detail: 0, z: i };
}

/** Formation for a card whose offset from the active (float) index is dd = i - c. */
function formationPose(dd: number, L: Layout): Pose {
  const hid = L.d * 0.6;
  const anchors: Pose[] = [
    { x: -L.sideX * 1.9, y: 0, w: hid, h: hid, r: hid / 2, rot: 0, o: 0, s: 1, detail: 0, z: 0 },
    { x: -L.sideX, y: 0, w: L.d, h: L.d, r: L.d / 2, rot: 0, o: 1, s: 1, detail: 0, z: 20 },
    { x: 0, y: 0, w: L.rw, h: L.rh, r: RECT_RADIUS, rot: 0, o: 1, s: 1, detail: 1, z: 30 },
    { x: L.sideX, y: 0, w: L.d, h: L.d, r: L.d / 2, rot: 0, o: 1, s: 1, detail: 0, z: 20 },
    { x: L.sideX * 1.9, y: 0, w: hid, h: hid, r: hid / 2, rot: 0, o: 0, s: 1, detail: 0, z: 0 },
  ];
  const f = clamp(dd, -2, 2) + 2; // 0..4
  const k = Math.min(3, Math.floor(f));
  const pose = mixPose(anchors[k], anchors[k + 1], f - k);
  pose.z = Math.round(30 - Math.min(Math.abs(dd), 2) * 10);
  return pose;
}

function poseAt(p: number, i: number, L: Layout): Pose {
  // Mobile starts directly in the circle / feature-card / circle carousel.
  if (L.mobile) return formationPose(i - dwell(clamp(p) * (N - 1)), L);

  // F+: carousel
  if (p >= T.F[0]) {
    const c = clamp((p - T.F[0]) / (T.F[1] - T.F[0])) * (N - 1);
    return formationPose(i - dwell(c), L);
  }
  // E: the stack folds into the formation (staggered, ends exactly on c = 0)
  if (p >= T.E[0]) {
    const len = T.E[1] - T.E[0];
    const t0 = T.E[0] + (i / (N - 1)) * len * 0.3;
    const t = smoother(clamp((p - t0) / (len * 0.7)));
    return mixPose(stackPose(i, L), formationPose(i, L), t);
  }
  // A + B: coins appear one by one in the stack
  const base = stackPose(i, L);
  const aLen = T.A[1] - T.A[0];
  const t = ph(p, T.A[0] + (i / (N - 1)) * aLen * 0.6, aLen * 0.4);
  return { ...base, s: outBack(t), o: Math.min(1, t * 4), y: base.y + (1 - t) * L.H * 0.06 };
}

/* ---------- component ---------- */
export function ProjectsShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const q = <T extends Element>(sel: string) => Array.from(section.querySelectorAll<T>(sel));
    const cards = q<HTMLElement>("[data-card]");
    const imgs = q<HTMLElement>("[data-img]");
    const nums = q<HTMLElement>("[data-coin]");
    const details = q<HTMLElement>("[data-detail]");
    const hits = q<HTMLButtonElement>("[data-hit]");
    const links = q<HTMLElement>("[data-link]");
    const titleEl = section.querySelector<HTMLElement>("[data-title]")!;
    const hud = section.querySelector<HTMLElement>("[data-hud]")!;
    const counter = section.querySelector<HTMLElement>("[data-count]")!;
    const track = section.querySelector<SVGPathElement>("[data-curve]")!;
    const trackGhost = section.querySelector<SVGPathElement>("[data-curve-ghost]")!;
    const dot = section.querySelector<HTMLElement>("[data-dot]")!;
    const stage = section.querySelector<HTMLElement>("[data-stage]")!;

    let L = layout(stage.clientWidth, stage.clientHeight);
    let curveLen = 0;
    let activeIdx = -2;

    // Per-element cache of the last written value, so unchanged frames cost nothing.
    const last = new Map<Element, string>();
    const write = (el: HTMLElement, key: string, css: string, apply: () => void) => {
      const id = key;
      if (last.get(el) === id + css) return;
      last.set(el, id + css);
      apply();
    };
    const r2 = (n: number) => Math.round(n * 100) / 100;

    const applyLayout = () => {
      L = layout(stage.clientWidth, stage.clientHeight);
      track.setAttribute("d", L.curve);
      trackGhost.setAttribute("d", L.curve);
      curveLen = track.getTotalLength();
      track.style.strokeDasharray = String(curveLen);
      const vis = L.mobile ? "0" : "1";
      track.style.opacity = vis; trackGhost.style.opacity = vis;
      last.clear();
    };

    const render = (p: number) => {
      cards.forEach((el, i) => {
        const pose = poseAt(p, i, L);
        const hidden = pose.o < 0.01;
        const box = `${r2(pose.w)}|${r2(pose.h)}|${r2(pose.r)}`;
        const tf = `translate3d(${r2(pose.x)}px,${r2(pose.y)}px,0) translate(-50%,-50%) rotate(${r2(pose.rot)}deg) scale(${r2(pose.s * 1000) / 1000})`;
        const key = `${tf}|${box}|${r2(pose.o * 100)}|${pose.z}`;
        write(el, "c", key, () => {
          el.style.width = `${r2(pose.w)}px`;
          el.style.height = `${r2(pose.h)}px`;
          el.style.borderRadius = `${r2(pose.r)}px`;
          el.style.transform = tf;
          el.style.opacity = String(r2(pose.o * 100) / 100);
          el.style.zIndex = String(pose.z);
          el.style.visibility = hidden ? "hidden" : "visible";
        });
        write(imgs[i], "i", String(r2(pose.detail * 100)), () => { imgs[i].style.opacity = String(0.45 + 0.55 * pose.detail); });
        write(nums[i], "n", String(r2(pose.detail * 100)), () => { nums[i].style.opacity = String(1 - clamp(pose.detail * 1.6)); });
        const dOp = clamp((pose.detail - 0.35) / 0.65);
        write(details[i], "d", String(r2(dOp * 100)), () => {
          details[i].style.opacity = String(dOp);
          details[i].style.transform = `translate3d(0,${r2((1 - pose.detail) * 18)}px,0)`;
        });
      });

      // SVG trace across the whole section
      const draw = L.mobile ? 0 : ph(p, 0, T.E[1]);
      track.style.strokeDashoffset = String(curveLen * (1 - draw));
      if (draw > 0 && curveLen) {
        const pt = track.getPointAtLength(curveLen * draw);
        dot.style.transform = `translate3d(${r2(pt.x)}px,${r2(pt.y)}px,0)`;
        dot.style.opacity = draw < 1 ? "1" : "0";
      } else dot.style.opacity = "0";

      // title leaves as the stack starts to fold
      const eLen = T.E[1] - T.E[0];
      const tOut = L.mobile ? 0 : ph(p, T.E[0], eLen * 0.35);
      titleEl.style.opacity = String(L.mobile ? 1 : r2((1 - tOut) * 100) / 100);
      titleEl.style.transform = `translate3d(0,${r2(-30 * tOut)}px,0)`;

      // HUD + which card is live (clickable)
      hud.style.opacity = String(L.mobile ? 1 : r2(ph(p, T.E[0] + eLen * 0.6, eLen * 0.4) * 100) / 100);
      const interactive = L.mobile || p >= T.E[1];
      const c = L.mobile ? clamp(p) * (N - 1) : clamp((p - T.F[0]) / (T.F[1] - T.F[0])) * (N - 1);
      const next = interactive ? Math.round(dwell(c)) : -1;
      if (next !== activeIdx) {
        activeIdx = next;
        cards.forEach((el, i) => {
          const live = interactive && i === next;
          const side = interactive && Math.abs(i - next) === 1;
          hits[i].style.pointerEvents = side ? "auto" : "none";
          hits[i].tabIndex = side ? 0 : -1;
          if (links[i]) {
            links[i].style.pointerEvents = live ? "auto" : "none";
            links[i].tabIndex = live ? 0 : -1;
          }
          el.setAttribute("aria-current", live ? "true" : "false");
        });
        if (next >= 0) counter.textContent = String(next + 1).padStart(2, "0");
      }
    };

    // One ticker callback eases toward the scroll position. Lenis already smooths the
    // scroll itself, so this is just a short, frame-rate-independent glide (not a tween per event).
    let target = 0;
    let shown = -1;
    const tick = (_t: number, dt: number) => {
      const k = 1 - Math.exp(-(dt / 1000) * 14);
      let next = shown + (target - shown) * k;
      if (Math.abs(target - next) < 0.00004) next = target;
      if (next !== shown) { shown = next; render(shown); }
    };

    const ctx = gsap.context(() => {
      applyLayout();
      shown = 0; render(0);
      gsap.ticker.add(tick);

      // Title reveal on the way in (plays forward and back with the scroll position)
      if (stage.clientWidth >= 768) {
        gsap.from("[data-title-line]", {
          yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.12,
          scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none reverse" },
        });
      }

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => "+=" + ((window.innerWidth < 768 ? UNITS.F : TOTAL) / 100) * stage.clientHeight,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: (self) => { applyLayout(); activeIdx = -2; target = self.progress; shown = self.progress; render(shown); },
        onUpdate: (self) => { target = self.progress; },
      });
      (section as HTMLElement & { _st?: ScrollTrigger })._st = st;
    }, section);
    const stopTicker = () => gsap.ticker.remove(tick);

    // Side circles jump to their project
    const goTo = (i: number) => {
      const st = (section as HTMLElement & { _st?: ScrollTrigger })._st;
      if (!st) return;
      const prog = L.mobile ? i / (N - 1) : T.F[0] + (i / (N - 1)) * (T.F[1] - T.F[0]);
      const target = st.start + prog * (st.end - st.start);
      const o = { y: window.scrollY };
      gsap.to(o, { y: target, duration: 0.9, ease: "power3.inOut", onUpdate: () => window.scrollTo({ top: o.y, behavior: "instant" as ScrollBehavior }) });
    };
    const handlers = hits.map((h, i) => {
      const fn = () => goTo(i);
      h.addEventListener("click", fn);
      return fn;
    });

    return () => {
      hits.forEach((h, i) => h.removeEventListener("click", handlers[i]));
      stopTicker();
      ctx.revert();
    };
  }, [reduced]);

  if (reduced) return <ProjectsGrid />;

  return (
    <section ref={sectionRef} id="selected-work" aria-labelledby="cs-work-title" className="relative bg-background">
      <div data-stage className="relative h-svh w-full overflow-hidden">
        {/* The curve that runs behind everything */}
        <svg aria-hidden className="pointer-events-none absolute inset-0 size-full">
          <path data-curve-ghost fill="none" stroke="#064b50" strokeOpacity="0.1" strokeWidth="2" />
          <path data-curve fill="none" stroke="#064b50" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <span
          data-dot
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 -ml-2.5 -mt-2.5 size-5 will-change-transform rounded-full border-2 border-[#171713] bg-primary-400 opacity-0"
        />

        {/* Title */}
        <div data-title className="pointer-events-none absolute inset-x-0 top-0 z-40 px-6 pt-24 sm:px-10 md:px-14 md:pt-28">
          <p className="eyebrow mb-3">Selected work · {String(N).padStart(2, "0")}</p>
          <h2 id="cs-work-title" className="font-display text-[clamp(2.75rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.02em]">
            <span className="block overflow-hidden pb-[0.1em]">
              <span data-title-line className="block">Selected</span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <span data-title-line className="block italic">work.</span>
            </span>
          </h2>
        </div>

        {/* Cards */}
        {items.map((it) => (
          <Card key={it.slug} it={it} />
        ))}

        {/* HUD */}
        <div
          data-hud
          className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex items-end justify-between px-6 pb-6 opacity-0 sm:px-10 md:px-14"
        >
          <p className="font-display text-3xl font-semibold tabular-nums md:text-5xl">
            <span data-count>01</span>
            <span className="text-muted"> / {String(N).padStart(2, "0")}</span>
          </p>
          <p className="eyebrow">Scroll · click a circle to jump</p>
        </div>
      </div>
    </section>
  );
}

function Card({ it }: { it: ShowcaseItem }) {
  return (
    <article
      data-card
      aria-label={`${it.title}, ${it.sector}`}
      className="absolute left-1/2 top-1/2 overflow-hidden opacity-0 shadow-lift will-change-transform [contain:layout_paint]"
      style={{ backgroundColor: it.bg, color: it.fg, width: 200, height: 200, borderRadius: 100 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img data-img src={it.imageSrc} alt="" decoding="async" className="absolute inset-0 size-full object-cover" />

      <span data-coin className="absolute inset-0 grid place-items-center font-display text-[clamp(1.5rem,3vw,2.75rem)] font-semibold">
        {it.number}
      </span>

      <div data-detail className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-5 pt-24 text-[#fff7eb] opacity-0 md:p-7 md:pt-32">
        <p className="eyebrow !text-[#fff7eb]/75">
          {it.number} · {it.sector}
        </p>
        <h3 className="mt-2 font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold leading-[1.05]">{it.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#fff7eb]/80">{it.summary}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {it.serviceLabels.map((s) => (
            <li key={s} className="rounded-full border border-[#fff7eb]/40 px-2.5 py-1 text-[0.7rem] font-medium">
              {s}
            </li>
          ))}
        </ul>
        {it.href ? (
          <Link data-link href={it.href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline">
            View case study <span aria-hidden>→</span>
          </Link>
        ) : (
          <p className="mt-4 text-sm font-semibold text-[#fff7eb]/60">Full case study coming soon</p>
        )}
      </div>

      {/* Whole-circle hit area, only live while this card is a side circle */}
      <button data-hit type="button" tabIndex={-1} aria-label={`Show ${it.title}`} className="absolute inset-0 cursor-pointer rounded-[inherit]" style={{ pointerEvents: "none" }} />
    </article>
  );
}

/** Reduced-motion fallback: same content, no pin, no motion. */
function ProjectsGrid() {
  return (
    <section id="selected-work" aria-labelledby="cs-work-title" className="px-6 py-24 sm:px-10 md:px-14">
      <p className="eyebrow mb-3">Selected work · {String(N).padStart(2, "0")}</p>
      <h2 id="cs-work-title" className="mb-12 font-display text-[clamp(2.75rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.02em]">
        Selected <span className="italic">work.</span>
      </h2>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => {
          const body = (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.imageSrc} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <div className="p-5">
                <p className="eyebrow opacity-70">{it.number} · {it.sector}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm opacity-80">{it.summary}</p>
              </div>
            </>
          );
          const cls = "block overflow-hidden rounded-2xl";
          return (
            <li key={it.slug}>
              {it.href ? (
                <Link href={it.href} className={cls} style={{ backgroundColor: it.bg, color: it.fg }}>{body}</Link>
              ) : (
                <div className={cls} style={{ backgroundColor: it.bg, color: it.fg }}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
