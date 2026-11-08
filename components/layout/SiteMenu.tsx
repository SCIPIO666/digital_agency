"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { legalHref, menuItems, socials } from "@/lib/site";
import { useLenis } from "@/components/providers/SmoothScroll";

/**
 * Full-page tile navigation. The fixed menu control opens a viewport-filling
 * page; selecting a tile or pressing Escape closes it.
 *
 * Animation lives in ONE paused GSAP timeline that we play/reverse from `open`.
 */
export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasOpenedRef = useRef(false);
  const previousOverflowRef = useRef("");

  // Keep fixed UI outside page and smooth-scroll containers. This prevents a
  // transformed/overflowing page section from trapping the menu or affecting
  // the document's scroll height when the menu opens.
  useEffect(() => setMounted(true), []);

  // Build the timeline once.
  useEffect(() => {
    if (!mounted) return;
    const panel = panelRef.current;
    if (!panel) return;

    const menuBackground = panel.querySelector<HTMLElement>("[data-menu-bg]");
    if (menuBackground) {
      gsap.set(menuBackground, { scale: 1, x: 0, y: 0, transformOrigin: "50% 50%" });
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = reduce ? 0 : 1; // multiplies every duration; 0 = instant

    const ctx = gsap.context(() => {
      const cards = panel.querySelectorAll("[data-menu-card]");
      const footer = panel.querySelectorAll("[data-menu-foot]");
      const intro = panel.querySelectorAll("[data-menu-intro]");

      // `invisible` in the markup hides the panel before JS runs; this reveals it
      // (parked off-screen) once GSAP owns it.
      gsap.set(panel, { yPercent: 100, autoAlpha: 1 });
      // opacity (not autoAlpha): visibility:hidden would stop the links taking focus on open
      gsap.set(cards, { y: 32, opacity: 0 });
      gsap.set(footer, { opacity: 0 });
      gsap.set(intro, { y: 18, opacity: 0 });
      timelineRef.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .to(panel, { yPercent: 0, duration: 0.9 * k }, 0)
        .to(intro, { y: 0, opacity: 1, duration: 0.7 * k, stagger: 0.09 * k }, 0.25 * k)
        .to(cards, { y: 0, opacity: 1, duration: 0.8 * k, stagger: 0.06 * k }, 0.18 * k)
        .to(footer, { opacity: 1, duration: 0.5 * k }, 0.45 * k);
    });

    return () => ctx.revert();
  }, [mounted]);

  // Ken Burns background move restarts with every open and stays independent
  // from the short panel open/close timeline.
  useEffect(() => {
    if (!mounted || !open || window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(max-width: 1023px)").matches) return;
    const background = panelRef.current?.querySelector<HTMLElement>("[data-menu-bg]");
    if (!background) return;

    const tween = gsap.fromTo(
      background,
      { scale: 1, x: 0, y: 0, transformOrigin: "50% 50%" },
      { scale: 1.06, x: 10, y: -8, transformOrigin: "50% 50%", duration: 6, ease: "sine.inOut", repeat: -1, yoyo: true, overwrite: true },
    );
    return () => {
      tween.kill();
    };
  }, [mounted, open]);

  // Play / reverse, lock page scroll, manage focus.
  useEffect(() => {
    if (!mounted) return;
    const tl = timelineRef.current;
    if (!tl) return;

    if (open) {
      hasOpenedRef.current = true;
      lenis?.stop();
      previousOverflowRef.current = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      tl.timeScale(1).play();
      panelRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    } else {
      lenis?.start();
      document.documentElement.style.overflow = previousOverflowRef.current;
      tl.timeScale(1.4).reverse();
      if (hasOpenedRef.current) buttonRef.current?.focus({ preventScroll: true });
    }
  }, [open, lenis, mounted]);

  // Esc closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Navigating anywhere closes the menu.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!mounted) return null;

  return createPortal((
    <>
      {/* The panel. `inert` removes it from tab order + screen readers while closed. */}
      <div
        ref={panelRef}
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        data-lenis-prevent
        className="invisible fixed inset-0 z-[95] overflow-y-auto bg-secondary-100 p-3 text-ink-950 sm:p-4 lg:p-5"
      >
        <div className="menu-page-grid min-h-[calc(100dvh-1.5rem)] gap-2.5 sm:min-h-[calc(100dvh-2rem)] sm:gap-3 lg:min-h-[calc(100dvh-2.5rem)] lg:gap-3.5">
          <section className="menu-intro relative isolate flex flex-col justify-between overflow-hidden rounded-xl bg-[#fff7eb] p-6 sm:p-8 lg:p-9">
            <div
              data-menu-bg
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-[8%] h-[58%] will-change-transform [mask-image:linear-gradient(to_bottom,transparent_0%,black_30%,black_55%,transparent_100%)] max-lg:hidden"
            >
              <img src="/stage/gallery-team.webp" alt="" className="size-full object-cover object-center" />
            </div>
            <div data-menu-intro className="relative z-10">
              <p className="font-sans text-[clamp(1.2rem,1.8vw,1.55rem)] font-bold tracking-tight text-ink-950">
                Nuevazen<span className="text-primary-700">.</span>
              </p>
              <p className="mt-2 text-[0.7rem] leading-[1.4] font-bold tracking-[0.16em] text-ink-700 uppercase">
                Make it <span className="text-primary-800">impossible to miss</span>
              </p>
            </div>
            <div className="relative z-10 max-w-sm">
              <div data-menu-intro className="mb-4 h-1 w-10 rounded-full bg-primary-500" aria-hidden="true" />
              <h2 data-menu-intro className="font-display text-[clamp(2rem,2.7vw,3.2rem)] leading-[0.95] tracking-[-0.01em] text-ink-950">
                One connected <span className="hl-chip">team</span>
              </h2>
              <p data-menu-intro className="mt-4 max-w-[24ch] font-display text-[clamp(1.1rem,1.5vw,1.4rem)] leading-snug text-ink-700">
                for your brand, your audience and your next big move.
              </p>
            </div>
          </section>

          <nav aria-label="Primary" className="contents">
          <ul className="contents">
            {menuItems.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href} data-menu-card data-tile={item.href === "/" ? "home" : item.href.slice(1)} className="menu-tile group relative min-h-40 overflow-hidden rounded-xl">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="flex size-full min-h-40 items-end p-5 outline-offset-4 sm:p-6 lg:p-7"
                  >
                    <span className="flex w-full items-end justify-between gap-2">
                      <span className="font-display text-3xl leading-none tracking-tight sm:text-4xl lg:text-[clamp(2rem,3vw,3.25rem)]">{item.label}</span>
                      <span className="mb-1 text-xs font-medium uppercase tracking-wider opacity-60">↗</span>
                    </span>
                  </Link>
                  {active && <span className="absolute top-5 right-5 size-2.5 rounded-full bg-primary-600" aria-hidden="true" />}
                </li>
              );
            })}
          </ul>
          </nav>

        <footer
          data-menu-foot
          className="menu-footer flex items-center justify-between rounded-xl bg-[#fff7eb] px-5 py-4 text-[0.65rem] font-bold uppercase tracking-nav sm:px-7"
        >
          <Link href={legalHref} className="hover:text-primary">
            Legal notices
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Follow us</span>
            <ul className="flex border border-border-strong">
              {socials.map((s) => (
                <li key={s.label} className="border-r border-border-strong last:border-r-0">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block px-4 py-2.5 hover:bg-primary hover:text-on-primary"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
        </div>
      </div>

      {/* The control moves to the top corner while the full-page menu is open. */}
      <div className={`fixed z-[110] transition-all duration-500 ease-out-expo ${open ? "top-6 right-6 bottom-auto left-auto translate-x-0 sm:top-8 sm:right-8" : "bottom-5 left-1/2 -translate-x-1/2"}`}>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className={`flex size-12 items-center justify-center rounded-full text-[0.6875rem] font-bold uppercase tracking-nav shadow-lift transition-[background-color,color,scale] duration-500 ease-out-expo hover:scale-105 active:scale-95 md:size-14 md:text-xs ${
            open ? "bg-ink-950 text-white" : "bg-primary text-on-primary"
          }`}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
    </>
  ), document.body);
}
