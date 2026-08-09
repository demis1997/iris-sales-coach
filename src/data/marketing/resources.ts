export type ResourceArticle = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  category: string;
  body: string[];
};

export const ARTICLES: ResourceArticle[] = [
  {
    slug: "ai-operating-system-for-sales",
    title: "Why high-volume sales teams need an AI operating system",
    description:
      "Transcription alone does not improve revenue. The operating loop from conversation to coaching to management does.",
    date: "2026-03-01",
    readingTime: "6 min",
    category: "Sales Intelligence",
    body: [
      "High-volume sales organizations generate thousands of conversations every week. Most of that signal disappears into recordings nobody has time to review.",
      "Managers sample a thin slice. Agents get inconsistent coaching. Executives see outcomes in a CRM without understanding the behaviors that created them.",
      "An AI operating system closes that loop: every conversation becomes structured understanding, live guidance, coaching, manager action, and revenue intelligence.",
      "That is the category Artemis is building — not a summarizer bolted onto a dialer.",
    ],
  },
  {
    slug: "coaching-after-every-call",
    title: "Coaching after every call — without burning manager hours",
    description:
      "Immediate, evidence-based feedback is how agents improve. Sampling random recordings is not.",
    date: "2026-03-08",
    readingTime: "5 min",
    category: "AI Coaching",
    body: [
      "The best coaching is specific, timely, and fair. Waiting until a weekly 1:1 to revisit a call from Monday is how habits calcify.",
      "Artemis scores conversations, cites transcript evidence, and proposes better phrasing for the next similar moment.",
      "Managers still matter — but they intervene on patterns and exceptions, not by trying to listen to every call.",
    ],
  },
  {
    slug: "forex-sales-floor-playbook",
    title: "What forex sales floors actually need from conversation AI",
    description:
      "FTDs, desks, withdrawal concerns, and compliance review — a practical lens for broker sales operations.",
    date: "2026-03-15",
    readingTime: "7 min",
    category: "Forex Sales Operations",
    body: [
      "Forex sales floors care about reach, qualification, trust, and first-time deposits. Generic call analytics often miss that language.",
      "The objections that block FTDs are often about withdrawals, credibility, and clarity — not product feature lists.",
      "Useful AI for this environment detects those moments live, coaches the close when intent appears, and helps managers see which desks are leaking conversion.",
      "Artemis’s interactive forex demo is built around that operating reality.",
    ],
  },
  {
    slug: "product-update-demo-workspace",
    title: "Product update: Apex Markets demo workspace",
    description:
      "A guided CEO → manager → agent story with a live sales workspace for presentations.",
    date: "2026-03-20",
    readingTime: "3 min",
    category: "Product Updates",
    body: [
      "We shipped an interactive Apex Markets demo so prospects can experience Artemis as CEOs, managers, and agents.",
      "The Sales Agent live workspace shows a softphone, streaming transcript, and Artemis Copilot during a simulated call.",
      "Explore it at /demo — clearly labeled as a Demo Workspace with Simulated AI.",
    ],
  },
];

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}
