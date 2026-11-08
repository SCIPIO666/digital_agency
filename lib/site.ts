// Single source of truth for site-wide content.
// The menu, the header, the footer row and the pages all read from here,
// so adding a page means: create app/<route>/page.tsx + add one entry below.

export const site = {
  name: "Nuevazen",
  tagline: "We make businesses impossible to miss.",
  description:
    "Digital marketing, web design and development, photography and video, graphic design, branding and print, content strategy, software and automation.",
};

export type MenuItem = {
  href: string;
  label: string;
  blurb: string;
  /** Optional preview image for the menu card, e.g. "/menu/services.webp". Placeholder is shown when omitted. */
  thumb?: string;
};

// Order here = order of the cards in the menu.
export const menuItems: MenuItem[] = [
  { href: "/", label: "Home", blurb: "Where it starts" },
  { href: "/services", label: "Services", blurb: "What we do" },
  { href: "/process", label: "Process", blurb: "How it works, start to finish" },
  { href: "/case-studies", label: "Case Studies", blurb: "Proof, not promises" },
  { href: "/reviews", label: "Reviews", blurb: "Word on the street" },
  { href: "/company", label: "Company", blurb: "The people behind the brand" },
  { href: "/contact", label: "Contact", blurb: "Let's talk" },
];
export const services = [
  "Digital Marketing",
  "Web Design & Dev",
  "Photography & Video",
  "Graphic Design",
  "Branding & Print",
  "Content Strategy",
  "Software",
  "Automation",
];

// TODO: replace "#" with the real profile URLs.
export const socials = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
];

export const legalHref = "/legal";
