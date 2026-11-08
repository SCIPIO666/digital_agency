// ===========================================================================
// STAGE CONFIG: the left half of the landing page.
// This file is the ASSET MANIFEST. Every place a generated image, video or
// 3D render goes is listed here. To use an asset:
//   1. Export it to the given size and drop it in  public/stage/
//   2. Set its `src` below (e.g.  src: "/stage/see-bg.webp")
//   3. Refresh. The placeholder disappears and your asset is live. No other code changes.
// ===========================================================================

/** Retained for the backed-up dark-mode stage. The live stage uses the ?hud query flag. */
export const STAGE_SHOW_HUD = true;

export type SlotKind = "image" | "image + depth map" | "video" | "logo (transparent)" | "screenshot";

export type AssetSlotDef = {
  scene: "SEE" | "TRUST" | "WANT" | "BOOK";
  kind: SlotKind;
  /** Suggested file name inside public/stage/ */
  file: string;
  /** Export size / format */
  size: string;
  /** What to generate */
  note: string;
  /** Set this when the asset exists. Leave undefined to show the placeholder. */
  src?: string;
  /** Videos only: still image shown before the video loads */
  poster?: string;
};

export const slots = {
  "see-bg": {
    scene: "SEE",
    kind: "image + depth map",
    file: "see-bg.webp",
    size: "1600×2000 (4:5), also see-bg-depth.png",
    note: "The 'invisible' hero: a business subject (storefront, product, sign) in near-black, lime rim light. Starts blurred, pulls into focus.",
  },
  "see-fg": {
    scene: "SEE",
    kind: "image",
    file: "see-fg.png",
    size: "1200×1600, transparent PNG cut-out",
    note: "Foreground object cut out from its background. Drifts faster than the bg (parallax depth).",
  },
  "trust-logo-1": {
    scene: "TRUST",
    kind: "logo (transparent)",
    file: "trust-logo-1.svg",
    size: "400×160 SVG or PNG, white or off-white",
    note: "Client logo 1, shown on the first review card.",
  },
  "trust-logo-2": {
    scene: "TRUST",
    kind: "logo (transparent)",
    file: "trust-logo-2.svg",
    size: "400×160 SVG or PNG, white or off-white",
    note: "Client logo 2.",
  },
  "trust-logo-3": {
    scene: "TRUST",
    kind: "logo (transparent)",
    file: "trust-logo-3.svg",
    size: "400×160 SVG or PNG, white or off-white",
    note: "Client logo 3.",
  },
  "want-hero": {
    scene: "WANT",
    kind: "video",
    file: "want-hero.mp4 (+ want-hero.webm, want-poster.webp)",
    size: "1080×1350 (4:5), 4–6s, silent, under 1.5 MB",
    note: "Brand-led macro of a product or crafted detail: materials, packaging, signage or a tactile process. Leave breathing room for the on-screen line 'A brand people remember.' Keep any logo faithful to the real source. Slow push-in; seamless looping is not required.",
  },
  "book-ui": {
    scene: "BOOK",
    kind: "screenshot",
    file: "book-ui.webp",
    size: "800×1600 (phone screen), under 200 KB",
    note: "A real booking/website screen from a client project, shown inside the phone mock-up.",
  },
} satisfies Record<string, AssetSlotDef>;

export type SlotId = keyof typeof slots;

// Mutable view so `src` can be filled in by editing the object above.
export const slotMap: Record<SlotId, AssetSlotDef> = slots;
