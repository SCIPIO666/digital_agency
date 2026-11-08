// Copy for the rotating arc cards. Deliberately NOT the service names: each card
// hints at what the service does for the client, so the arc and the numbered stack
// below it never read as two lists of the same thing.
//
// kicker = one word shown on a lime tag and in the arc header. line = the card copy.
// Keyed by the slugs in lib/services.ts.

export type Teaser = { kicker: string; line: string };

export const teasers: Record<string, Teaser> = {
  "digital-marketing": { kicker: "Found", line: "Be the first answer when someone searches at midnight." },
  "web-design-dev": { kicker: "Open", line: "A front door that’s always open, and always inviting." },
  "photography-video": { kicker: "Seen", line: "Light, lens and a story worth pausing for." },
  "graphic-design": { kicker: "Clear", line: "Say the complicated thing in a single glance." },
  "branding-print": { kicker: "Remembered", line: "A name they repeat. A mark they’d spot across the street." },
  "content-strategy": { kicker: "Heard", line: "Know what to say, who to say it to, and when." },
  software: { kicker: "Built", line: "The tool your team wishes already existed." },
  automation: { kicker: "Effortless", line: "The follow-up that sends itself." },
};
