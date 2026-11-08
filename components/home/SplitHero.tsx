import Link from "next/link";
import { MediaStage } from "@/components/home/MediaStage";

/**
 * The whole landing page: ONE full-screen split component, not a scrolling page.
 * Desktop (md+): two halves side by side, locked to the viewport height.
 * Mobile: the stage is screen one, the message is screen two (stacked, scrollable).
 */
export function SplitHero() {
  return (
    <div className="bg-background md:grid md:h-dvh md:grid-cols-2 md:overflow-hidden">
      <section
        aria-labelledby="hero-title"
        className="hero-panel-reveal order-1 relative flex min-h-dvh flex-col items-center justify-center border-border bg-[#fffefa] px-6 py-28 text-center md:order-2 md:min-h-0 md:h-full md:border-l md:py-16"
      >
        <p className="text-focus-in absolute top-6 left-1/2 hidden w-full -translate-x-1/2 text-[0.6875rem] font-bold tracking-eyebrow text-muted uppercase md:block md:top-7">
          <span className="text-primary-700">Brand</span>
          <span aria-hidden="true" className="text-border-strong"> · </span>
          <span className="text-accent-600">Web</span>
          <span aria-hidden="true" className="text-border-strong"> · </span>
          <span className="text-ink-700">Content</span>
          <span aria-hidden="true" className="text-border-strong"> · </span>
          <span className="text-muted">Automation</span>
        </p>

        <h1
          id="hero-title"
          className="text-pop-up-top max-w-[11ch] font-sans text-[clamp(2.8rem,5.5vw,5.0rem)] leading-[0.88] font-semibold tracking-[-0.04em] uppercase opacity-0"
        >
          We make businesses impossible to miss
        </h1>

        <p className="text-focus-in supporting-copy-focus mt-8 max-w-prose font-display text-quote text-body">
          Software and automation, photography and video, design, branding, web, digital marketing, content. One
          connected team that gets you found, trusted and booked.
        </p>

        <div className="hero-copy-follow mt-10 inline-flex divide-x divide-foreground/70 border border-foreground/70 text-xs font-bold uppercase tracking-nav">
          <Link href="/case-studies" className="px-6 py-3.5 transition-colors hover:bg-primary hover:text-on-primary">
            Our work
          </Link>
          <Link href="/contact" className="px-6 py-3.5 transition-colors hover:bg-primary hover:text-on-primary">
            Contact us
          </Link>
        </div>
      </section>

      <div className="order-2 md:order-1">
        <MediaStage />
      </div>
    </div>
  );
}
