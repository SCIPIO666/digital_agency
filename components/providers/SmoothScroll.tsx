"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Lenis drives the scrolling; GSAP's ticker drives Lenis, so any future
// ScrollTrigger animation and the smooth scroll share one clock.
const LenisContext = createContext<Lenis | null>(null);

/** Access the Lenis instance (null until mounted, or when reduced motion is on). */
export const useLenis = () => useContext(LenisContext);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({ autoRaf: false, lerp: 0.1 });
    const tick = (time: number) => instance.raf(time * 1000);

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const offScroll = instance.on("scroll", ScrollTrigger.update);
    setLenis(instance);

    return () => {
      offScroll();
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // New route = start at the top.
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
