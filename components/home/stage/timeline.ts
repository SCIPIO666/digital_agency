import gsap from "gsap";
import { addEngineAct, ENGINE_DURATION } from "@/components/home/stage/engine";

export const IRIS_IN = 0.8;
export const IRIS_OUT = 1;

export const ACTS = [
  { id: "see", label: "See", dur: 6.5 },
  { id: "trust", label: "Trust", dur: 5 },
  { id: "wave", label: "Want", dur: 6 },
  { id: "paint", label: "Design", dur: 3 },
  { id: "ripple", label: "Web", dur: 4.5 },
  { id: "engine", label: "Book", dur: ENGINE_DURATION },
] as const;

type Sel = (q: string) => HTMLElement[];
type Builder = (s: Sel, dur: number, stageWidth: number) => gsap.core.Timeline;
type SceneAct = (typeof ACTS)[number]["id"];
const pin = (tl: gsap.core.Timeline, dur: number) => tl.to({}, { duration: dur }, 0);

const builders: Record<Exclude<SceneAct, "engine">, Builder> = {
  see: (s, dur) => {
    const tl = gsap.timeline();
    tl.fromTo(s("[data-bg]"), { scale: 1.3, filter: "blur(16px) brightness(.55)" }, { scale: 1, filter: "blur(0px) brightness(.92)", duration: 2.3, ease: "power3.out" }, 0)
      .fromTo(s("[data-hero]"), { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.25, ease: "expo.out" }, 0.25)
      .fromTo(s("[data-tile]"), { scale: 0.72, rotateY: 22, opacity: 0 }, { scale: 1, rotateY: 0, opacity: 1, duration: 1.1, stagger: 0.12, ease: "expo.out" }, 0.65)
      .to(s("[data-zoom]"), { scale: 1.12, duration: 4.8, ease: "none" }, 1.1)
      .to(s("[data-tile]"), { x: (i: number) => ((i % 3) - 1) * 180, y: (i: number) => (i < 3 ? -1 : 1) * 150, scale: 0.35, opacity: 0, duration: 0.85, stagger: 0.08, ease: "power3.in" }, 4.7);
    return pin(tl, dur);
  },
  trust: (s, dur, stageWidth) => {
    const tl = gsap.timeline();
    const cards = s("[data-card]");
    const heroCard = cards[Math.floor(cards.length / 2)];
    tl.fromTo(s("[data-card]"), { y: 65, rotateY: -12, opacity: 0 }, { y: 0, rotateY: 0, opacity: 1, duration: 1.05, stagger: 0.18, ease: "expo.out" }, 0.2)
      .fromTo(s("[data-cursor]"), { x: -stageWidth * 0.08, y: "8vh", scale: 0.65 }, { x: stageWidth * 0.72, y: "-14vh", scale: 1, duration: dur - 0.7, ease: "sine.inOut" }, 0.35)
      .to(cards.filter((_, i) => i !== Math.floor(cards.length / 2)), { opacity: 0, duration: 0.35, stagger: 0.06, ease: "power2.in" }, 3.65)
      .to(heroCard ?? [], { scale: 2.8, zIndex: 3, duration: 0.45, ease: "power3.inOut" }, 3.7)
      .fromTo(s("[data-proof]"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }, 3.8);
    return pin(tl, dur);
  },
  wave: (s, dur) => {
    const tl = gsap.timeline();
    tl.fromTo(s("[data-wave-tile]"), { x: 130, rotateY: 24, opacity: 0 }, { x: 0, rotateY: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: "expo.out" }, 0.2)
      .to(s("[data-wave-tile]"), { y: (i: number) => Math.sin(i * 0.8) * 52, z: (i: number) => Math.cos(i * 0.8) * 42, rotateX: (i: number) => Math.sin(i * 0.8) * 11, rotateY: (i: number) => Math.cos(i * 0.8) * 9, duration: 1.15, ease: "sine.inOut", yoyo: true, repeat: 1, stagger: 0.05 }, 1.4)
      .fromTo(s("[data-brand-title]"), { y: 28, opacity: 0, filter: "blur(12px)", letterSpacing: "-0.1em" }, { y: 0, opacity: 1, filter: "blur(0px)", letterSpacing: "-0.03em", duration: 0.75, ease: "back.out(1.2)" }, 0.78)
      .to(s("[data-wave-tile]"), { y: 0, z: 0, rotateX: 0, rotateY: 0, duration: 1.1, stagger: 0.04, ease: "power2.inOut" }, dur - 1.4);
    return pin(tl, dur);
  },
  paint: (s, dur) => {
    const tl = gsap.timeline();
    tl.fromTo(s("[data-paint]"), { attr: { strokeDashoffset: 1000 } }, { attr: { strokeDashoffset: 0 }, duration: 0.6, stagger: 0.15, ease: "power3.inOut" }, 0.25);
    return pin(tl, dur);
  },
  ripple: (s, dur) => {
    const tl = gsap.timeline();
    tl.fromTo(s("[data-ripple-image]"), { scale: 1.12, filter: "saturate(.65)" }, { scale: 1, filter: "saturate(1)", duration: dur, ease: "none" }, 0)
      .fromTo(s("[data-ripple]"), { scale: 0.12, opacity: 0.85 }, { scale: 3, opacity: 0, duration: 0.9, ease: "power2.out" }, 2.8)
      .to(s("[data-displace]"), { attr: { scale: 72 }, duration: 0.18, ease: "power2.out" }, 2.8)
      .to(s("[data-displace]"), { attr: { scale: 0 }, duration: 1.1, ease: "power2.out" }, 2.98)
      .fromTo(s("[data-press]"), { scale: 1 }, { scale: 0.94, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.inOut" }, 2.8);
    return pin(tl, dur);
  },
};

export type StageHandle = { master: gsap.core.Timeline; starts: number[]; total: number };

export function buildStage(root: HTMLElement): StageHandle {
  const rect = root.getBoundingClientRect();
  const desktop = window.matchMedia("(min-width: 768px)").matches;
  const ox = desktop ? rect.width : rect.width / 2;
  const oy = rect.height - 52;
  const radius = Math.hypot(rect.width, rect.height) + 40;
  const clip = (r: number) => `circle(${r}px at ${ox}px ${oy}px)`;
  const irisRing = root.querySelector<HTMLElement>("[data-iris-ring]");
  if (irisRing) gsap.set(irisRing, { width: radius * 2, height: radius * 2, left: ox, top: oy, xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
  const scenes = ACTS.map((act) => root.querySelector<HTMLElement>(`[data-scene="${act.id}"]`)!);
  const master = gsap.timeline({ repeat: -1 });
  const starts: number[] = [];
  let time = 0;

  ACTS.forEach((act, i) => {
    const scene = scenes[i];
    starts.push(time);
    master.set(scene, { zIndex: i + 1 }, time);
    if (act.id === "engine") {
      master.fromTo(scene, { clipPath: "polygon(0 0,28% 0,72% 72%,72% 0,100% 0,100% 100%,72% 100%,28% 28%,28% 100%,0 100%)", scale: 1.035 }, { clipPath: "polygon(0 0,28% 0,56% 0,72% 0,100% 0,100% 34%,100% 68%,100% 100%,42% 100%,0 100%)", scale: 1, duration: IRIS_IN, ease: "expo.inOut" }, time);
    } else {
      master.fromTo(scene, { clipPath: clip(0), scale: 1.035 }, { clipPath: clip(radius), scale: 1, duration: IRIS_IN, ease: "expo.inOut" }, time);
    }
    if (irisRing && act.id !== "engine") master.fromTo(irisRing, { scale: 0, opacity: 0.95 }, { scale: 1, opacity: 0, duration: IRIS_IN, ease: "expo.inOut" }, time);
    if (i > 0) {
      const oldCopy = scenes[i - 1].querySelectorAll("[data-scene-copy], [data-web-copy], [data-proof]");
      master.to(oldCopy, { autoAlpha: 0, y: -10, duration: 0.25, ease: "power3.inOut" }, time - 0.25);
      master.set(scenes[i - 1], { clipPath: clip(0) }, time + IRIS_IN);
    }
    if (act.id !== "engine") {
      const incomingCopy = scene.querySelectorAll("[data-scene-copy], [data-web-copy]");
      master.fromTo(incomingCopy, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power3.out" }, time + IRIS_IN * 0.7);
    }
    const actDuration = desktop ? act.dur : act.id === "ripple" ? 0.08 : act.dur;
    if (act.id === "ripple" && !desktop) master.to({}, { duration: actDuration }, time);
    else if (act.id === "engine") {
      if (!addEngineAct(master, root, time)) master.to({}, { duration: actDuration }, time);
    }
    else master.add(builders[act.id](gsap.utils.selector(scene) as Sel, actDuration, rect.width), time);
    time += actDuration;
  });
  const finalCopy = scenes[scenes.length - 1].querySelectorAll("[data-scene-copy], [data-proof]");
  master.to(finalCopy, { autoAlpha: 0, y: -10, duration: 0.25, ease: "power3.inOut" }, time - IRIS_OUT - 0.25);
  master.to(scenes[scenes.length - 1], { clipPath: clip(0), duration: IRIS_OUT, ease: "expo.inOut" }, time - IRIS_OUT);
  if (irisRing) master.fromTo(irisRing, { scale: 1, opacity: 0 }, { scale: 0, opacity: 0.95, duration: IRIS_OUT, ease: "expo.inOut" }, time - IRIS_OUT);
  master.to({}, { duration: 0.3 }, time);
  return { master, starts, total: time + 0.3 };
}
