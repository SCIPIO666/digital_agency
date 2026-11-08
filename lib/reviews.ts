// Testimonials for the Reviews page ("river of street cred").
//
// ALL ENTRIES ARE PLACEHOLDERS. The wording only exists so the canvas has realistic
// text lengths to lay out. Replace every quote, name and business with real,
// approved client words before launch. Do not ship invented testimonials.
//
// Keep each quote between ~70 and ~150 characters: short ones are set larger.
// The canvas repeats this list forever, so 24 to 36 entries feels endless.

export type Review = { id: string; quote: string; name: string; role: string };

const raw: [string, string][] = [
  ["We stopped being the best-kept secret in town.", "Client Name · Restaurant"],
  ["They made our website do what it was always supposed to: bring in the right enquiries.", "Client Name · Professional services"],
  ["The photos alone changed how people talk about us.", "Client Name · Retail"],
  ["Finally, one team that sees the brand, the site and the campaign as the same job.", "Client Name · Hospitality"],
  ["Our busiest season ran on the automations they built. We barely touched a spreadsheet.", "Client Name · Events"],
  ["Clear, fast, and honest about what would actually work.", "Client Name · Health & wellness"],
  ["I came for a logo. I left with a brand people recognise before they read the name.", "Client Name · Start-up"],
  ["They explained things in plain language and then delivered exactly what they said.", "Client Name · Property"],
  ["Our content plan went from guesswork to a calendar the whole team trusts.", "Client Name · Education"],
  ["Bookings started arriving without anyone chasing them.", "Client Name · Travel"],
  ["The film they shot for us still gets mentioned by customers months later.", "Client Name · Manufacturing"],
  ["Creative and commercial at the same time, which is rarer than it should be.", "Client Name · Fashion"],
  ["They treated our budget like it was their own.", "Client Name · Non-profit"],
  ["Every deadline met, every revision handled without drama.", "Client Name · Logistics"],
  ["The new site is faster, clearer and, most importantly, ours.", "Client Name · Finance"],
  ["Our packaging finally looks like the product tastes.", "Client Name · Food & drink"],
  ["Search used to be a mystery. Now it is our most reliable source of new customers.", "Client Name · Local services"],
  ["They built the tool we had been describing for years in a single sprint.", "Client Name · Operations"],
  ["People say our brand feels bigger than we are. That is the point.", "Client Name · Studio"],
  ["Calm in a crunch, sharp in the details.", "Client Name · Agency partner"],
  ["From the first call it felt like they were already on our team.", "Client Name · Construction"],
  ["The follow-up flows alone paid for the project.", "Client Name · E-commerce"],
  ["Not one template in sight. Everything was made for us.", "Client Name · Creative"],
  ["We went from three tools and a lot of copy-pasting to one clean workflow.", "Client Name · Consulting"],
  ["Our launch looked like a company ten times our size.", "Client Name · Technology"],
  ["They listen first, then they make something better than the brief.", "Client Name · Interiors"],
  ["The printed pieces and the website could have come from the same hand, because they did.", "Client Name · Boutique hotel"],
  ["Our team finally has words, visuals and a plan that all agree with each other.", "Client Name · Health care"],
  ["Easy to work with, hard to forget.", "Client Name · Fitness"],
  ["We get asked who did our brand at least once a week.", "Client Name · Cafe"],
];

export const reviews: Review[] = raw.map(([quote, who], i) => {
  const [name, role] = who.split(" · ");
  return { id: `review-${i + 1}`, quote, name, role };
});
