// Content for the Company page (renamed from About). One file, so copy changes
// never touch a component. Anything marked PLACEHOLDER must be confirmed with the
// team before launch.
//
// Images this page needs (both in /public):
//   /stage/gallery-team.webp     the full-width team banner
//   /team/member-1..7.*          one headshot per team member (see `team` below)

// 1. Hero: Huge's "Since '99." -> "Since 2024."
export const hero = {
  eyebrow: "Company",
  title: "Since 2024.",
  copy:
    "We’re Nuevazen, a human-first, AI-native design and technology company built for moments when technology and culture are changing faster than businesses.",
};

// 3. "By numbers" cards. PLACEHOLDER: confirm every figure.
export const stats: { to: number; suffix?: string; plain?: boolean; label: string }[] = [
  { to: 2, suffix: "+", label: "Years building." },
  { to: 8, label: "Disciplines under one roof." },
  { to: 7, label: "People on the team." },
  { to: 4, label: "Values holding us together." },
];
/** Alias used by CompanyIntro */
export const numbers = stats;

// 4. "Made differently_" two-column text (Nearform pattern)
export const differently = {
  heading: "Made differently",
  paragraphs: [
    "The way customers find and choose a business changed faster than most businesses could keep up. People search, scroll and compare long before they ever call. When attention is the scarcest thing there is, how do you make sure it lands on you?",
    "Since 2024, Nuevazen has been the studio businesses call to be seen, trusted and chosen. One team, eight disciplines, no templates, and a plain-spoken promise to make you impossible to miss.",
  ],
};

// 5. Pinned dark section: the heading with two annotation blocks (Nearform pattern)
export const means = {
  heading: "Made differently",
  top: [
    "Means design and strategy at one table",
    "Means craft over templates",
    "Means film, code and content in-house",
    "Means one team, one standard",
  ],
  bottom: [
    "Means plain talk",
    "Means results you can measure",
    "Means no handoffs lost",
    "Means impossible to miss",
  ],
};

// 6. "Experienced hands" paragraphs
export const experienced = {
  heading: "Growth deserves experienced hands",
  paragraphs: [
    "Our small senior team builds brands, websites, films and systems designed for business impact, not just for show.",
    "We deliver outcomes, not decks. Launches, not pilots. Craft, not slop.",
    "We’re the team businesses call when they are tired of juggling five freelancers who never quite line up.",
    "AI and automation may be changing what’s possible, but they haven’t changed what good work demands: clear thinking, honest feedback and care for the detail.",
  ],
};

// 7. TEAM: 7 placeholders. Replace `name`, `role` and `photo` with the real people.
// `photo` is a path inside /public. If the file is missing, a coloured initial tile shows instead.
export const team: { name: string; role: string; photo: string; bg: string }[] = [
  { name: "Name", role: "Founder & Creative Director", photo: "/team/member-1.svg", bg: "#ffb768" },
  { name: "Name", role: "Head of Strategy", photo: "/team/member-2.svg", bg: "#d8e4b8" },
  { name: "Name", role: "Lead Designer", photo: "/team/member-3.svg", bg: "#ffb9a7" },
  { name: "Name", role: "Lead Developer", photo: "/team/member-4.svg", bg: "#c4b5fd" },
  { name: "Name", role: "Photo & Video", photo: "/team/member-5.svg", bg: "#d4d2cf" },
  { name: "Name", role: "Content Lead", photo: "/team/member-6.svg", bg: "#ffb768" },
  { name: "Name", role: "Automation Engineer", photo: "/team/member-7.svg", bg: "#d8e4b8" },
];

// 8. "We're not just another digital company": the four value cards
export const valuesBlock = {
  heading: "We’re not just another digital company.",
  items: [
    {
      lead: "Bold",
      text: "Complexity brings out the best in us. We would rather make the brave call than the safe, forgettable one.",
      color: "#65a30d",
      icon: "bolt",
    },
    {
      lead: "Open",
      text: "Our process is out in the open. You see the work, the reasoning and the numbers, not just the final file.",
      color: "#8b5cf6",
      icon: "globe",
    },
    {
      lead: "Makers",
      text: "Brand, web, film and code are made in-house, so the details survive from the first idea to launch day.",
      color: "#f0440a",
      icon: "star",
    },
    {
      lead: "Doers",
      text: "We would rather get to work than talk about it. Outcomes are what move your business forward.",
      color: "#171713",
      icon: "cursor",
    },
  ] as const,
};

// 9. Pre-CTA block
export const preCta = {
  title: "Built different since day one.",
  copy: "Design-led. Systems-driven. Expert-built. The capabilities that turn ideas into impact.",
  links: [
    { label: "Our services", href: "/services" },
    { label: "Case studies", href: "/case-studies" },
    { label: "Our process", href: "/process" },
  ],
};


// 10. Timeline entries for CompanyStory
export const timeline: { year: string; title: string; text: string; bg: string }[] = [
  { year: "2024", title: "Founded", text: "Nuevazen launched as a human-first, AI-native design and technology company.", bg: "#ffb768" },
  { year: "2024", title: "First clients", text: "Delivered brand, web and film projects for businesses across multiple industries.", bg: "#d8e4b8" },
  { year: "2025", title: "Full team", text: "Grew to seven specialists covering eight disciplines under one roof.", bg: "#c4b5fd" },
];

// 11. Values cards for CompanyStory
export const values: { n: string; title: string; text: string; bg: string; fg: string }[] = [
  { n: "01", title: "Bold", text: "Complexity brings out the best in us. We would rather make the brave call than the safe, forgettable one.", bg: "#171713", fg: "#fafaf8" },
  { n: "02", title: "Open", text: "Our process is out in the open. You see the work, the reasoning and the numbers, not just the final file.", bg: "#fafaf8", fg: "#171713" },
  { n: "03", title: "Makers", text: "Brand, web, film and code are made in-house, so the details survive from the first idea to launch day.", bg: "#65a30d", fg: "#fafaf8" },
  { n: "04", title: "Doers", text: "We would rather get to work than talk about it. Outcomes are what move your business forward.", bg: "#f0440a", fg: "#fafaf8" },
];
