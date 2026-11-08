import gsap from "gsap";

/** The Engine beat needs room for its automation steps to read. */
export const ENGINE_DURATION = 9;

/** Add the Engine's workflow animation inside the existing scene transition. */
export function addEngineAct(master: gsap.core.Timeline, root: HTMLElement, at = 0) {
  const scene = root.querySelector<HTMLElement>('[data-scene="engine"]');
  if (!scene) return null;

  const q = gsap.utils.selector(scene);
  const card = q("[data-engine-card]");
  const copy = q("[data-scene-copy]");
  const bannerLines = q("[data-engine-banner-line]");
  const bannerTag = q("[data-engine-banner-tag]");
  const rise = q("[data-engine-rise]");
  const tag = q("[data-engine-tag]");
  const bar = q("[data-engine-bar]");
  const nodes = q("[data-engine-node]");
  const lines = q("[data-engine-line]");
  const pulses = q("[data-engine-pulse]");
  const dots = q("[data-engine-dot]");
  const badge = q("[data-engine-badge]");
  const check = q("[data-engine-check]");

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.fromTo(copy, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power3.out" }, 0.56)
    .fromTo(bannerLines, { yPercent: 112, opacity: 0, filter: "blur(12px)", textShadow: "0 0 0 transparent" }, { yPercent: 0, opacity: 1, filter: "blur(0px)", textShadow: "0 1px 0 rgb(90 96 79 / 18%), 0 10px 24px rgb(20 24 16 / 12%)", duration: 0.7, stagger: 0.14, ease: "back.out(1.25)" }, 0.82)
    .fromTo(bannerTag, { autoAlpha: 0, y: 10, filter: "blur(8px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.55 }, 1.28)
    .fromTo(card, { scale: 0.86, y: 28, autoAlpha: 0 }, { scale: 1, y: 0, autoAlpha: 1, duration: 0.9, ease: "expo.out" }, 0.2)
    .fromTo(rise, { yPercent: 110 }, { yPercent: 0, duration: 0.7 }, 0.7)
    .fromTo(tag, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 1)
    .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 5.2, ease: "power1.inOut" }, 1.6);

  tl.fromTo(
    nodes,
    { autoAlpha: 0, scale: 0.8, x: (_i: number, el: Element) => ((el as HTMLElement).dataset.side === "l" ? -48 : 48) },
    { autoAlpha: 1, scale: 1, x: 0, duration: 0.8, stagger: 0.45, ease: "back.out(1.4)" },
    1.4,
  );

  // The cards float independently from their entrance motion, then settle before the iris closes.
  tl.fromTo(
    nodes,
    { y: 0 },
    { y: (i: number) => (i % 2 ? -9 : 9), duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: 1, stagger: 0.15, immediateRender: false },
    2.2,
  );

  tl.fromTo(lines, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, stagger: 0.45, ease: "power2.inOut" }, 1.8)
    .fromTo(pulses, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 3.6)
    .fromTo(
      pulses,
      { strokeDashoffset: 0.07 },
      { strokeDashoffset: -1, duration: 1.1, stagger: 0.22, ease: "none", repeat: 1, immediateRender: false },
      3.6,
    )
    .to(pulses, { autoAlpha: 0, duration: 0.2 }, 6.6)
    .fromTo(card, { boxShadow: "0 0 0 0 rgba(163,230,53,0)" }, { boxShadow: "0 0 0 10px rgba(163,230,53,0.35)", duration: 0.35, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, 4.2);

  tl.fromTo(dots, { backgroundColor: "#d4d1c9", scale: 1 }, { backgroundColor: "#84cc16", scale: 1.5, duration: 0.3, stagger: 0.3, yoyo: true, repeat: 1, ease: "power2.out" }, 5.2);
  tl.set(dots, { backgroundColor: "#84cc16", scale: 1 }, 6.8);

  tl.fromTo(badge, { scale: 0, rotate: -30 }, { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2)" }, 6.4)
    .fromTo(check, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, 6.7);

  tl.set({}, {}, ENGINE_DURATION);
  master.add(tl, at);
  return tl;
}
