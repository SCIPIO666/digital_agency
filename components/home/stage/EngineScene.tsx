const media = (file: string) => `/media/${file}`;
const stageAsset = (file: string) => `/stage/${file}`;

const NODES = [
  { id: "lead", title: "Lead captured", note: "Website form to CRM", side: "l", cls: "left-[5%] top-[35%]" },
  { id: "reply", title: "Reply sent", note: "WhatsApp, automatically", side: "r", cls: "right-[5%] top-[39%]" },
  { id: "book", title: "Booking confirmed", note: "Calendar updated", side: "l", cls: "left-[5%] bottom-[12%]" },
  { id: "invoice", title: "Invoice sent", note: "Follow-ups on autopilot", side: "r", cls: "right-[5%] bottom-[8%]" },
] as const;

const ANCHORS = [[20, 41], [80, 45], [20, 77], [80, 81]] as const;

function DashboardImage() {
  return <img src={stageAsset("dashboard.webp")} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />;
}

/** Software and Automation feature beat: a clear banner over an animated workflow. */
export function EngineScene() {
  return (
    <div data-scene="engine" className="absolute inset-0 overflow-hidden bg-secondary-100" style={{ clipPath: "circle(0px)" }}>
      <div className="bg-glow-lime absolute inset-0" aria-hidden="true" />

      <div data-scene-copy className="absolute left-[5%] right-[5%] top-[5%] z-10 text-center text-foreground">
        <p className="mb-2 text-[0.58rem] font-bold uppercase tracking-[0.2em] text-primary-700 md:text-xs">Software, made useful</p>
        <h2 className="text-[clamp(2.1rem,4.2vw,3.6rem)] font-bold uppercase leading-[0.82] tracking-[-0.055em]">
          <span className="block overflow-hidden"><span data-engine-banner-line className="block">Software</span></span>
          <span className="block overflow-hidden"><span data-engine-banner-line className="block text-primary-700">&amp; Automation</span></span>
        </h2>
        <p data-engine-banner-tag className="mt-3 font-display text-sm text-body md:mt-4 md:text-base">Less busywork. More momentum.</p>
      </div>

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" fill="none">
        {ANCHORS.map(([x, y], i) => {
          const d = `M${x} ${y} Q${x} 56 50 56`;
          return (
            <g key={i}>
              <path data-engine-line d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1} stroke="#a3e635" strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <path data-engine-pulse d={d} pathLength={1} strokeDasharray="0.07 0.93" stroke="#4d7c0f" strokeWidth={4} strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ opacity: 0, visibility: "hidden" }} />
            </g>
          );
        })}
      </svg>

      {NODES.map((node) => (
        <div key={node.id} data-engine-node data-side={node.side} className={`absolute z-20 w-[38%] max-w-[12rem] rounded-xl border border-border bg-card p-2.5 shadow-card md:p-3 ${node.cls}`}>
          <div className="flex items-center gap-2">
            <span data-engine-dot className="size-2 shrink-0 rounded-full bg-secondary-300" />
            <p className="text-[0.58rem] font-bold uppercase leading-tight tracking-nav text-foreground md:text-[0.65rem]">{node.title}</p>
          </div>
          <p className="mt-1 hidden text-[0.62rem] leading-tight text-muted sm:block">{node.note}</p>
        </div>
      ))}

      <div className="absolute inset-0 z-30 grid place-items-center">
        <div data-engine-card className="relative w-[min(44%,18rem)] rounded-3xl">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
            <div className="relative aspect-[4/3] bg-secondary-200">
              <video className="absolute inset-0 size-full object-cover" src={media("145864-787701151_medium.mp4")} autoPlay muted loop playsInline preload="metadata" />
              <div className="bg-gradient-to-t absolute inset-0 from-black/40 to-transparent" />
            </div>
            <div className="p-3 md:p-4">
              <p className="text-[0.6rem] font-bold uppercase tracking-eyebrow text-primary-700">The engine</p>
              <h3 className="mt-1 overflow-hidden font-sans text-[clamp(1.35rem,2.8vw,2.25rem)] font-semibold uppercase leading-[0.9] tracking-[-0.04em] text-foreground">
                <span data-engine-rise className="block">Work in motion.</span>
              </h3>
              <p data-engine-tag className="mt-2 text-[0.62rem] leading-snug text-body md:text-xs">Capture, reply, book, invoice. The busywork moves itself.</p>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-border"><div data-engine-bar className="h-full origin-left rounded-full bg-primary-500" /></div>
            </div>
          </div>

          <div data-engine-badge className="absolute -right-3 -top-3 grid size-12 place-items-center rounded-full border-2 border-foreground bg-primary-400 shadow-glow-strong md:-right-4 md:-top-4 md:size-14">
            <svg viewBox="0 0 24 24" className="size-6 md:size-7" fill="none" aria-hidden="true">
              <path data-engine-check d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} strokeDasharray={1} strokeDashoffset={1} stroke="#171713" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div data-engine-dashboard className="absolute right-[7%] top-[25%] z-20 h-[12%] w-[20%] overflow-hidden rounded-lg border-2 border-white bg-white shadow-xl md:right-[10%] md:top-[24%] md:h-[15%] md:w-[17%]">
        <DashboardImage />
        <span className="absolute bottom-1 left-1 rounded bg-white/90 px-1.5 py-0.5 text-[0.48rem] font-bold uppercase tracking-wide text-foreground md:bottom-1.5 md:left-1.5 md:text-[0.55rem]">Connected systems</span>
      </div>
    </div>
  );
}
