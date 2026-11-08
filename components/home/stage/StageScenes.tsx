import { EngineScene } from "@/components/home/stage/EngineScene";

const media = (file: string) => `/media/${file}`;
const stageAsset = (file: string) => `/stage/${file}`;

const photos = {
  andre: "see-hero.webp",
  andrew: "gallery-andrew.webp",
  baby: "gallery-work.webp",
  camera: "camera-detail.webp",
  flatlay: "design-flatlay.webp",
  group: "gallery-team.webp",
  laptop: "website-laptop.webp",
  secondFlatlay: "design-workspace.webp",
  gear: "camera-gear.webp",
  dashboard: "dashboard.webp",
  portrait: "gallery-portrait.webp",
  studio: "camera-studio.webp",
} as const;

function Photo({ file, className = "" }: { file: string; className?: string }) {
  return <img src={stageAsset(file)} alt="" loading="lazy" decoding="async" className={`absolute inset-0 size-full object-cover ${className}`} />;
}

function Label({ number, children, tone = "image" }: { number: string; children: React.ReactNode; tone?: "image" | "paper" }) {
  const text = tone === "paper" ? "text-foreground" : "text-white";
  const accent = tone === "paper" ? "text-primary-700" : "text-lime-300";
  return <div data-scene-copy className={`absolute bottom-7 left-6 z-10 drop-shadow-lg md:bottom-10 md:left-10 ${text}`}><p className={`mb-2 text-[0.65rem] font-bold uppercase tracking-[0.24em] ${accent}`}>{number} <span className={tone === "paper" ? "text-foreground/65" : "text-white/65"}>/ {children}</span></p><p className="text-5xl font-bold uppercase leading-[0.85] tracking-tight md:text-7xl">{children}</p></div>;
}

const base = "absolute inset-0 overflow-hidden bg-[#10120f]";

function See() {
  const tiles = [photos.camera, photos.dashboard, photos.flatlay, photos.andrew, photos.gear, photos.laptop];
  return <div data-scene="see" className={base} style={{ clipPath: "circle(0px)" }}>
    <div data-bg className="absolute -inset-[8%]"><Photo file={photos.andre} className="object-[center_38%]" /></div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/15" />
    <video className="absolute inset-0 size-full object-cover opacity-20 mix-blend-screen" src={media("119290-717347154_medium.mp4")} autoPlay muted loop playsInline preload="metadata" />
    <div data-zoom className="absolute inset-[13%] grid grid-cols-3 grid-rows-2 gap-2 opacity-80 md:inset-[12%] md:gap-3">
      {tiles.map((file, i) => <div key={file} data-tile className={`will-change-transform relative overflow-hidden rounded-xl border border-white/20 shadow-2xl ${i >= 3 ? "hidden sm:block" : ""} ${i === 0 ? "ring-2 ring-lime-300" : ""}`}><Photo file={file} /></div>)}
    </div>
    <div data-hero className="absolute inset-0 grid place-items-center"><div className="relative h-[70%] w-[44%] overflow-hidden rounded-2xl shadow-2xl md:w-[39%]"><Photo file={photos.andre} className="object-[center_35%]" /><div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" /></div></div>
    <Label number="01" >See</Label>
  </div>;
}

function Trust() {
  const people = [photos.group, photos.andrew, photos.baby, photos.portrait, photos.studio];
  return <div data-scene="trust" className={base} style={{ clipPath: "circle(0px)" }}>
    <div className="absolute inset-0 bg-[#161a15]" />
    <p data-scene-copy className="absolute left-6 top-7 z-10 max-w-[70%] text-3xl font-medium leading-tight text-white md:left-10 md:top-10 md:text-5xl">People remember how you make them feel.</p>
    <div data-gallery className="absolute inset-x-[7%] top-[24%] bottom-[18%] grid grid-cols-3 gap-2 md:inset-x-[9%] md:grid-cols-5 md:gap-4">
      {people.map((file, i) => <div key={file} data-card className={`relative overflow-hidden rounded-xl ${i >= 3 ? "hidden md:block" : ""} ${i % 2 ? "mt-10" : "mb-8"}`}><Photo file={file} /><div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" /></div>)}
    </div>
    <div data-cursor className="pointer-events-none absolute left-[12%] top-[60%] z-20 size-5 rounded-full border-2 border-lime-300 shadow-[0_0_22px_6px_rgba(163,230,53,.35)]"><span className="absolute left-5 top-3 whitespace-nowrap rounded-full bg-lime-300 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-widest text-black">Your people</span></div>
    <div data-proof className="absolute bottom-[18%] right-[8%] z-10 max-w-48 rounded-xl border border-white/20 bg-black/70 px-4 py-3 text-right text-xs font-semibold leading-relaxed text-white opacity-0 shadow-2xl backdrop-blur md:right-[11%] md:max-w-56 md:px-5 md:py-4 md:text-sm">Seen.<br />Trusted.<br />Wanted.</div>
    <Label number="02">Trust</Label>
  </div>;
}

function Wave() {
  const shots = [photos.camera, photos.andrew, photos.flatlay, photos.gear, photos.secondFlatlay, photos.portrait, photos.studio];
  return <div data-scene="wave" className={base} style={{ clipPath: "circle(0px)" }}>
    <div data-wall className="absolute inset-[-8%] flex items-center justify-center gap-2 [perspective:900px] md:gap-4">
      {shots.map((file, i) => <div key={file} data-wave-tile className="will-change-transform relative h-[62%] min-w-[21%] overflow-hidden rounded-xl shadow-2xl md:min-w-[19%]" style={{ transform: `rotateY(${(i - 3) * 6}deg) translateY(${i % 2 ? 18 : -12}px)` }}><Photo file={file} /></div>)}
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15" />
    <div data-scene-copy className="absolute right-6 top-8 z-10 max-w-[45%] text-right text-white drop-shadow-lg md:right-10 md:top-10 md:max-w-[42%]">
      <p className="mb-2 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-lime-300 md:text-xs">Brand · Identity · Story</p>
      <h3 data-brand-title className="text-[clamp(1.6rem,3.6vw,3rem)] font-semibold leading-[0.88] tracking-tight">A brand<br />people remember.</h3>
    </div>
    <Label number="03">Want</Label>
    <p data-scene-copy className="absolute bottom-10 right-8 z-10 max-w-36 text-right text-xs font-bold uppercase tracking-[0.18em] text-white md:right-10 md:max-w-48 md:text-sm">Photography<br />&amp; moving image</p>
  </div>;
}

function Paint() {
  return <div data-scene="paint" className={base} style={{ clipPath: "circle(0px)" }}>
    <div className="absolute inset-0 bg-[#b8e84b]" />
    <div data-paint-image className="absolute inset-0 grid grid-cols-2 gap-2 p-3 md:gap-4 md:p-6" style={{ mask: "url(#paint-mask)", WebkitMask: "url(#paint-mask)" }}>
      {[photos.flatlay, photos.secondFlatlay].map((file) => <div key={file} className="relative overflow-hidden rounded-xl bg-stone-100"><Photo file={file} className="opacity-90" /></div>)}
    </div>
    <svg data-paint-overlay className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
      <defs><filter id="paint-edge" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="4" result="grain" /><feDisplacementMap in="SourceGraphic" in2="grain" scale="12" /></filter>
        <mask id="paint-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000"><rect width="1000" height="1000" fill="black" />
        <path data-paint filter="url(#paint-edge)" d="M-80 220 C180 100 260 340 520 220 S850 90 1080 225" pathLength="1000" stroke="white" strokeWidth="330" strokeLinecap="round" strokeDasharray="1000" strokeDashoffset="1000" fill="none" />
        <path data-paint filter="url(#paint-edge)" d="M-60 500 C190 360 330 630 540 485 S820 360 1080 520" pathLength="1000" stroke="white" strokeWidth="350" strokeLinecap="round" strokeDasharray="1000" strokeDashoffset="1000" fill="none" />
        <path data-paint filter="url(#paint-edge)" d="M-80 780 C170 620 330 860 560 720 S850 610 1080 790" pathLength="1000" stroke="white" strokeWidth="340" strokeLinecap="round" strokeDasharray="1000" strokeDashoffset="1000" fill="none" />
      </mask></defs>
    </svg>
    <div className="absolute inset-0 bg-gradient-to-t from-white/25 via-transparent to-transparent" />
    <Label number="04" tone="paper">Want</Label>
    <p data-scene-copy className="absolute bottom-10 right-8 z-10 text-right text-xs font-bold uppercase tracking-[0.18em] text-foreground md:right-10 md:text-sm">Design · Branding · Print</p>
  </div>;
}

function Ripple() {
  return <div data-scene="ripple" className={`${base} hidden md:block`} style={{ clipPath: "circle(0px)" }}>
    <svg className="absolute size-0" aria-hidden="true"><filter id="stage-ripple" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="7" result="noise" /><feDisplacementMap data-displace in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" /></filter></svg>
    <div data-ripple-image className="absolute inset-[-5%]" style={{ filter: "url(#stage-ripple)" }}><Photo file={photos.laptop} /></div>
    <div className="absolute inset-0 bg-black/35" />
    <div data-ripple className="pointer-events-none absolute left-[22%] top-[38%] size-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-lime-300/90 shadow-[0_0_32px_8px_rgba(163,230,53,.35)] md:size-32" />
    <div data-web-copy className="absolute left-[12%] top-[16%] z-10 max-w-[75%] text-white"><p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-lime-300">Web · digital</p><h3 className="text-4xl font-bold leading-[0.9] md:text-6xl">Build your<br />dream website.</h3><span data-press className="mt-5 inline-flex rounded-full bg-lime-300 px-5 py-3 text-xs font-bold uppercase tracking-widest text-black">Let’s build</span></div>
    <Label number="05">Book</Label>
  </div>;
}

export function StageScenes() {
  return <><See /><Trust /><Wave /><Paint /><Ripple /><EngineScene /></>;
}
