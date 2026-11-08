import { services as allServices } from "@/lib/services";

// Projects shown on the Case Studies page.
//
// ALL ENTRIES BELOW ARE PLACEHOLDERS. Replace them with real projects; don't ship
// invented clients or results.
//
// `image` points to a related visual from /public/media as a temporary stand-in.
// Replace it with approved project artwork and real names/copy before presenting these
// as completed client case studies.
//
// href: add it once a project has its own page. Without it the card is not a link.

export type CaseStudy = {
  slug: string;
  title: string;
  sector: string;
  /** Slugs from lib/services.ts. Rendered as small tags. */
  services: string[];
  /** One or two sentences: the problem, then what changed. */
  summary: string;
  /** Supplied media-pool image used as a visual stand-in until project artwork is ready. */
  image: string;
  href?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "project-01", title: "Project 01", sector: "Photography & film", services: ["photography-video"],
    summary: "Replace with the real project story.", image: "andre-hunter-FeQjEuneogU-unsplash.webp",
  },
  {
    slug: "project-02", title: "Project 02", sector: "Web & digital", services: ["web-design-dev"],
    summary: "Replace with the real project story.", image: "carlos-muza-hpjSkU2UYSU-unsplash.webp",
  },
  {
    slug: "project-03", title: "Project 03", sector: "Brand & print", services: ["branding-print"],
    summary: "Replace with the real project story.", image: "2h-media-NmSPbe0bDtc-unsplash.webp",
  },
  {
    slug: "project-04", title: "Project 04", sector: "Photography & film", services: ["photography-video"],
    summary: "Replace with the real project story.", image: "andrew-itaga-JgqExx4jQ6g-unsplash.webp",
  },
  {
    slug: "project-05", title: "Project 05", sector: "Software", services: ["software"],
    summary: "Replace with the real project story.", image: "ngital-8OYcY9CRP_0-unsplash.webp",
  },
  {
    slug: "project-06", title: "Project 06", sector: "People & stories", services: ["content-strategy"],
    summary: "Replace with the real project story.", image: "claudio-goncalves-LNSqupGyzds-unsplash.webp",
  },
  {
    slug: "project-07", title: "Project 07", sector: "Web & digital", services: ["web-design-dev"],
    summary: "Replace with the real project story.", image: "carriza-maiquez-RTdvy9izXvw-unsplash.webp",
  },
  {
    slug: "project-08", title: "Project 08", sector: "Brand & print", services: ["graphic-design"],
    summary: "Replace with the real project story.", image: "thiago-japyassu-fKdcqCaHQh4-unsplash.webp",
  },
  {
    slug: "project-09", title: "Project 09", sector: "Photography & film", services: ["photography-video"],
    summary: "Replace with the real project story.", image: "conor-luddy-IVaKksEZmZA-unsplash.webp",
  },
  {
    slug: "project-10", title: "Project 10", sector: "Automation", services: ["automation"],
    summary: "Replace with the real project story.", image: "path-digital-tR0jvlsmCuQ-unsplash.webp",
  },
];

// ---------------------------------------------------------------------------
// Showcase helpers (used by components/case-studies/ProjectsShowcase.tsx)
// ---------------------------------------------------------------------------

// Menu-tile palette, so the coins feel like part of the same family as the menu.
const coinPalette = [
  { bg: "#ffb768", fg: "#171713" },
  { bg: "#064b50", fg: "#fff7eb" },
  { bg: "#ffb9a7", fg: "#171713" },
  { bg: "#f0440a", fg: "#fff7eb" },
  { bg: "#d8e4b8", fg: "#171713" },
  { bg: "#d4d2cf", fg: "#171713" },
  { bg: "#c4b5fd", fg: "#171713" },
];

export type ShowcaseItem = CaseStudy & {
  index: number;
  number: string;
  bg: string;
  fg: string;
  imageSrc: string;
  serviceLabels: string[];
};

export const showcaseItems: ShowcaseItem[] = caseStudies.map((c, index) => {
  const tone = coinPalette[index % coinPalette.length];
  return {
    ...c,
    index,
    number: String(index + 1).padStart(2, "0"),
    bg: tone.bg,
    fg: tone.fg,
    imageSrc: `/media/${c.image}`,
    serviceLabels: c.services.map((s) => allServices.find((x) => x.slug === s)?.title ?? s),
  };
});
