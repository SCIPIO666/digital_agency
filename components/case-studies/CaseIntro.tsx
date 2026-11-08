"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const PARAS = [
  "We design and build websites, brand work and software that work as hard as they look.",
  "Every project here started with a business that wanted to be found, trusted and booked. Here’s how each one got there.",
];

const ink = "rgba(23,23,19,0.45)";
const faint = "rgba(23,23,19,0.1)";
const handle = { transformBox: "fill-box", transformOrigin: "center" } as const;

function Words({ text, index }: { text: string; index: number }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden py-[0.08em] align-top">
            <span data-word={index} className="inline-block">{word}</span>
          </span>{" "}
        </span>
      ))}
    </>
  );
}

/** The original light blueprint panel, with its two statements controlled by scroll. */
export function CaseIntro() {
  const rootRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set("[data-para]", { clearProps: "all" });
        gsap.set("[data-word]", { clearProps: "all" });
        gsap.set("[data-shape]", { opacity: 0.45 });
        return;
      }

      // Let the light panel rise over the green band as it enters the viewport.
      gsap.fromTo(panel, { scale: 0.94, y: 60 }, {
        scale: 1, y: 0, ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "top 35%", scrub: true, invalidateOnRefresh: true },
      });

      const firstWords = root.querySelectorAll<HTMLElement>('[data-word="0"]');
      const secondWords = root.querySelectorAll<HTMLElement>('[data-word="1"]');
      const firstParagraph = root.querySelector<HTMLElement>('[data-para="0"]');
      const secondParagraph = root.querySelector<HTMLElement>('[data-para="1"]');
      const shapeA = root.querySelector<SVGGElement>('[data-shape="a"]');
      const shapeB = root.querySelector<SVGGElement>('[data-shape="b"]');
      if (!firstParagraph || !secondParagraph || !shapeA || !shapeB) return;

      const strokesA = shapeA.querySelectorAll<SVGElement>("[data-stroke]");
      const strokesB = shapeB.querySelectorAll<SVGElement>("[data-stroke]");
      const handlesA = shapeA.querySelectorAll<SVGElement>("[data-handle]");
      const handlesB = shapeB.querySelectorAll<SVGElement>("[data-handle]");

      // One scrubbed timeline: reveal, hold, transition, reveal the next statement, hold.
      // ScrollTrigger scrubbing makes the whole sequence reverse naturally on scroll-up.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.6}`,
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(firstWords, { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.035, ease: "power3.out", immediateRender: false }, 0)
        .fromTo(strokesA, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.5, stagger: 0.12, ease: "power2.inOut" }, 0.1)
        .fromTo(handlesA, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.45, stagger: 0.05, ease: "back.out(3)" }, 0.8)
        .to({}, { duration: 0.8 })
        .to(firstWords, { yPercent: -110, duration: 0.6, stagger: 0.012, ease: "power3.in" })
        .to(firstParagraph, { opacity: 0, duration: 0.45 }, "<")
        .to(shapeA, { opacity: 0, duration: 0.45 }, "<")
        .fromTo(secondParagraph, { yPercent: 18, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, ">-0.05")
        .fromTo(secondWords, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.03, ease: "power3.out" }, "<")
        .to(shapeB, { opacity: 1, duration: 0.45 }, "<")
        .fromTo(strokesB, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.35, stagger: 0.12, ease: "power2.inOut" }, "<0.05")
        .fromTo(handlesB, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.45, stagger: 0.05, ease: "back.out(3)" }, "<0.65")
        .to({}, { duration: 1 });
    }, root);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section ref={rootRef} aria-label="About our work" className="relative z-10 bg-primary-950 px-3 pb-3 md:px-5 md:pb-5">
      <div
        ref={panelRef}
        className={`relative isolate grid min-h-[85dvh] place-items-center overflow-hidden rounded-[2rem] bg-secondary-100 px-6 py-28 shadow-lift md:px-16 ${reduce ? "" : "will-change-transform"}`}
      >
        <svg aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" fill="none">
          <g stroke={faint} strokeWidth={1}>
            <path d="M150 0V700M520 0V700M860 0V700" />
            <path d="M0 130H1200M0 330H1200M0 640H1200" />
          </g>
          <g data-shape="a" stroke={ink} strokeWidth={1.4}>
            <path d="M670 330A190 190 0 1 1 290 330A190 190 0 1 1 670 330" pathLength={1} strokeDasharray={1} strokeDashoffset={0} data-stroke />
            <path d="M400 140H560" pathLength={1} strokeDasharray={1} strokeDashoffset={0} data-stroke />
            <path d="M290 250V410" pathLength={1} strokeDasharray={1} strokeDashoffset={0} data-stroke />
            <rect data-handle x={475} y={135} width={10} height={10} style={handle} />
            <rect data-handle x={285} y={325} width={10} height={10} style={handle} />
            <circle data-handle cx={400} cy={140} r={3.5} style={handle} />
            <circle data-handle cx={560} cy={140} r={3.5} style={handle} />
            <circle data-handle cx={290} cy={250} r={3.5} style={handle} />
            <circle data-handle cx={290} cy={410} r={3.5} style={handle} />
          </g>
          <g data-shape="b" stroke={ink} strokeWidth={1.4} opacity={0}>
            <path d="M860 160H1060V360H960V520H860Z" pathLength={1} strokeDasharray={1} strokeDashoffset={0} data-stroke />
            <path d="M180 560C300 380 420 320 620 330" pathLength={1} strokeDasharray={1} strokeDashoffset={0} data-stroke />
            <rect data-handle x={855} y={155} width={10} height={10} style={handle} />
            <rect data-handle x={1055} y={155} width={10} height={10} style={handle} />
            <rect data-handle x={1055} y={355} width={10} height={10} style={handle} />
            <rect data-handle x={855} y={515} width={10} height={10} style={handle} />
            <circle data-handle cx={180} cy={560} r={3.5} style={handle} />
            <circle data-handle cx={620} cy={330} r={3.5} style={handle} />
          </g>
        </svg>

        <div className={`relative z-10 max-w-3xl ${reduce ? "space-y-12" : "grid"}`}>
          {PARAS.map((text, index) => (
            <p
              key={index}
              data-para={index}
              className={`font-sans text-center text-[clamp(1.75rem,4.2vw,3.5rem)] leading-[1.12] tracking-[-0.02em] text-foreground ${reduce ? "" : "col-start-1 row-start-1"} ${!reduce && index === 1 ? "opacity-0" : ""}`}
            >
              {reduce ? text : <Words text={text} index={index} />}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
