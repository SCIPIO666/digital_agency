// Process page content. Edit copy here; components just render it.
// PLACEHOLDER copy: confirm steps and wording with the team.
//
// Colours come from the nav menu / services palette. Every step has TWO surfaces:
//   left  = the content column (description + services at this stage)
//   right = the big number + step title
// so the split changes colour on both sides at each step.

export const processHero = {
  eyebrow: "Our process",
  title: "How we work.",
  copy: "Six steps, no black boxes. You see the thinking, the work and the numbers at every stage, from the first conversation to long after launch.",
};

export type Step = {
  n: string;
  title: string;
  copy: string;
  /** Services offered at this stage. */
  services: string[];
  left: { bg: string; fg: string };
  right: { bg: string; fg: string; num: string };
};

const INK = "#171713";
const CREAM = "#fff7eb";

export const steps: Step[] = [
  {
    n: "01",
    title: "Listen",
    copy: "We start with your business, not our toolkit. Goals, customers, constraints and what has already been tried.",
    services: ["Discovery call", "Goals and success measures", "Audit of what exists"],
    left: { bg: "#ffb768", fg: INK },
    right: { bg: "#064b50", fg: CREAM, num: "#a3e635" },
  },
  {
    n: "02",
    title: "Define",
    copy: "We turn what we heard into a plain-language plan: positioning, scope, timeline and who does what.",
    services: ["Strategy brief", "Scope and timeline", "Fixed-price proposal"],
    left: { bg: "#d8e4b8", fg: INK },
    right: { bg: "#f0440a", fg: CREAM, num: "#ffb768" },
  },
  {
    n: "03",
    title: "Design",
    copy: "Brand, interface and story take shape together, so the identity, the site and the content feel like one thing.",
    services: ["Brand and visual direction", "Page and flow design", "Content outline"],
    left: { bg: "#064b50", fg: CREAM },
    right: { bg: "#ffb9a7", fg: INK, num: "#f0440a" },
  },
  {
    n: "04",
    title: "Build",
    copy: "Designers and developers work side by side. Film, photography, code and automation are made in-house.",
    services: ["Web and software build", "Photo and video production", "Automations wired in"],
    left: { bg: "#c4b5fd", fg: INK },
    right: { bg: INK, fg: CREAM, num: "#a3e635" },
  },
  {
    n: "05",
    title: "Launch",
    copy: "We test, polish and ship with a checklist, then watch the first weeks closely so nothing slips.",
    services: ["QA across devices", "Go-live and handover", "Launch campaign"],
    left: { bg: "#f0440a", fg: CREAM },
    right: { bg: "#d8e4b8", fg: INK, num: "#064b50" },
  },
  {
    n: "06",
    title: "Grow",
    copy: "Launch is the start. We measure, learn and keep improving so the work keeps paying for itself.",
    services: ["Monthly reporting", "Experiments and iteration", "Ongoing support"],
    // Deliberately NOT lime: the contact CTA right below is lime, so the last step must contrast with it.
    left: { bg: "#064b50", fg: CREAM },
    right: { bg: "#ffb768", fg: INK, num: "#064b50" },
  },
];
