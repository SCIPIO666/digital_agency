// Content for the Services page. Used by BOTH the rotating arc cards and the
// stacked service cards, so edit copy here once.
//
// Card images: put a .webp named after each `slug` in /public/services/
//   e.g. /public/services/digital-marketing.webp
// Until an image exists the diagonal-stripe placeholder shows instead.

export type Service = {
  slug: string;
  number: string;
  title: string;
  /** One short phrase, shown on the arc card. */
  phrase: string;
  /** Two sentences max, shown on the stacked card. */
  description: string;
  capabilities: string[];
  /** Stacked-card background + text colour (reuses the menu tile palette). */
  bg: string;
  fg: string;
  image: string;
};

const dark = "#171713";
const light = "#fff7eb";

// Use distinct images already in /public/services and /public/media. Keep the
// card visuals relevant to each service while bespoke service assets are pending.
const serviceImages: Record<string, string> = {
  "digital-marketing": "/media/path-digital-tR0jvlsmCuQ-unsplash.webp",
  "web-design-dev": "/media/carriza-maiquez-RTdvy9izXvw-unsplash.webp",
  "photography-video": "/services/video%20and%20photography.webp",
  "graphic-design": "/media/thiago-japyassu-fKdcqCaHQh4-unsplash.webp",
  "branding-print": "/media/2h-media-NmSPbe0bDtc-unsplash.webp",
  "content-strategy": "/media/merakist-jyoSxjUE22g-unsplash.webp",
  software: "/services/x-kwzWjTnDPLk-unsplash.webp",
  automation: "/media/prashant-hiremath-phS1wAgXOQI-unsplash.webp",
};

const raw = [
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    phrase: "Be found by people ready to buy.",
    description:
      "Search, social and paid campaigns tied to one goal: more of the right customers, and clear proof of what is working.",
    capabilities: ["SEO", "Paid media", "Social", "Email", "Analytics"],
    bg: "#ffb768",
    fg: dark,
  },
  {
    slug: "web-design-dev",
    title: "Web Design & Dev",
    phrase: "Sites that look sharp and convert.",
    description:
      "Fast, accessible websites designed around how your customers decide, and built to be easy for your team to run.",
    capabilities: ["UX & UI", "Front-end build", "CMS", "E-commerce", "Performance"],
    bg: "#d8e4b8",
    fg: dark,
  },
  {
    slug: "photography-video",
    title: "Photography & Video",
    phrase: "Visuals people stop scrolling for.",
    description:
      "Product, people and place, shot and cut to feel like you. Stills, brand films and short social video from one crew.",
    capabilities: ["Brand photography", "Product shoots", "Brand films", "Social video", "Post-production"],
    bg: "#064b50",
    fg: light,
  },
  {
    slug: "graphic-design",
    title: "Graphic Design",
    phrase: "Clear, striking, instantly yours.",
    description:
      "Layouts, illustration and visual systems that make complicated things simple and keep everything looking like one brand.",
    capabilities: ["Campaign creative", "Illustration", "Social templates", "Presentations", "Packaging"],
    bg: "#ffb9a7",
    fg: dark,
  },
  {
    slug: "branding-print",
    title: "Branding & Print",
    phrase: "An identity you can hold in your hand.",
    description:
      "Names, identities and guidelines, then the printed pieces that put them in people's hands.",
    capabilities: ["Brand identity", "Guidelines", "Stationery", "Signage", "Print production"],
    bg: "#f0440a",
    fg: light,
  },
  {
    slug: "content-strategy",
    title: "Content Strategy",
    phrase: "Words with a plan behind them.",
    description:
      "A plan for what to say, where to say it and how often, then the writing to back it up.",
    capabilities: ["Messaging", "Editorial calendars", "Copywriting", "Case studies", "SEO content"],
    bg: "#d4d2cf",
    fg: dark,
  },
  {
    slug: "software",
    title: "Software",
    phrase: "Custom tools built around how you work.",
    description:
      "Web apps, portals and internal tools built around the way your business actually runs.",
    capabilities: ["Web apps", "Dashboards", "Client portals", "Integrations", "Maintenance"],
    bg: "#a3e635",
    fg: dark,
  },
  {
    slug: "automation",
    title: "Automation",
    phrase: "Let the busywork run itself.",
    description:
      "Connect your tools so leads, bookings, invoices and follow-ups move on their own.",
    capabilities: ["Workflow design", "CRM setup", "Email & SMS flows", "AI assistants", "Reporting"],
    bg: "#c4b5fd",
    fg: dark,
  },
] as const;

export const services: Service[] = raw.map((s, i) => ({
  ...s,
  capabilities: [...s.capabilities],
  number: String(i + 1).padStart(2, "0"),
  image: serviceImages[s.slug] ?? "/stage/website-laptop.webp",
}));
