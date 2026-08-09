export type SolutionPage = {
  slug: string;
  path: string;
  title: string;
  subtitle: string;
  seoTitle: string;
  seoDescription: string;
  points: { title: string; body: string }[];
  outcomes: string[];
  demoHref: string;
  demoLabel: string;
};

export const SOLUTIONS: SolutionPage[] = [
  {
    slug: "sales",
    path: "/solutions/sales",
    title: "Help every rep perform like your best rep.",
    subtitle:
      "Live copilot, personal coaching, roleplay, and clear next actions — so improvement happens after every conversation.",
    seoTitle: "Sales Solutions | Artemis AI",
    seoDescription:
      "AI sales solutions for agents — live copilot, call coaching, roleplay, and personal improvement loops.",
    points: [
      { title: "Live copilot", body: "Guidance during the conversation when it can still change the outcome." },
      { title: "Call coaching", body: "Immediate, evidence-based feedback after every call." },
      { title: "Roleplay", body: "Practice hard scenarios before talking to real customers." },
      { title: "Next actions", body: "Leave every call with a clear follow-up — not a blank CRM note." },
      { title: "Personal improvement", body: "Rep DNA shows which skills are rising and which need focus." },
    ],
    outcomes: ["More consistent discovery", "Fewer missed buying signals", "Faster ramp for new agents"],
    demoHref: "/demo/agent",
    demoLabel: "Explore Agent Demo",
  },
  {
    slug: "sales-management",
    path: "/solutions/sales-management",
    title: "Know who needs attention — and why.",
    subtitle:
      "Manager queues, team comparison, call evidence, coaching assignments, and a live floor view.",
    seoTitle: "Sales Management Solutions | Artemis AI",
    seoDescription:
      "Sales management software for coaching, live floor visibility, team performance, and call evidence.",
    points: [
      { title: "Manager queue", body: "Ranked interventions instead of random call sampling." },
      { title: "Team comparison", body: "See quality and conversion side by side." },
      { title: "Call evidence", body: "Open the exact moment that needs coaching." },
      { title: "Coaching", body: "Assign focused practice with due dates." },
      { title: "Live floor", body: "Monitor active calls and AI signals in real time." },
    ],
    outcomes: ["Less time scrubbing recordings", "More targeted coaching", "Faster intervention on risk"],
    demoHref: "/demo/manager",
    demoLabel: "Explore Manager Demo",
  },
  {
    slug: "revenue-leaders",
    path: "/solutions/revenue-leaders",
    title: "Turn conversations into revenue intelligence.",
    subtitle:
      "Forecasting context, conversion drivers, revenue at risk, lost reasons, and executive reporting.",
    seoTitle: "Revenue Leader Solutions | Artemis AI",
    seoDescription:
      "Revenue intelligence for sales leaders — conversion drivers, revenue at risk, and executive AI briefs.",
    points: [
      { title: "Conversion clarity", body: "Know which desks and behaviors move the number." },
      { title: "Revenue at risk", body: "Prioritize high-intent opportunities still open." },
      { title: "Lost reasons", body: "See systemic blockers across the organization." },
      { title: "Executive reporting", body: "Weekly briefs grounded in conversation evidence." },
      { title: "Coaching impact", body: "Connect enablement work to conversion movement." },
    ],
    outcomes: ["Faster diagnosis of conversion dips", "Clearer desk accountability", "Better weekly decisions"],
    demoHref: "/demo/ceo",
    demoLabel: "Explore CEO Demo",
  },
  {
    slug: "quality-assurance",
    path: "/solutions/quality-assurance",
    title: "Review the right calls, not every call.",
    subtitle:
      "AI scoring, review queues, manual overrides, calibration, and risk detection for QA teams.",
    seoTitle: "QA Solutions | Artemis AI",
    seoDescription:
      "Quality assurance for contact centers and sales floors — AI scoring, review queues, and calibration.",
    points: [
      { title: "AI scoring", body: "Score every conversation against your rubric." },
      { title: "Review queue", body: "Focus humans on exceptions and edge cases." },
      { title: "Manual overrides", body: "Keep humans in control of final judgments." },
      { title: "Calibration", body: "Align AI and human reviewers over time." },
      { title: "Risk detection", body: "Flag conversations that may need compliance review." },
    ],
    outcomes: ["Broader coverage", "Less sampling bias", "Clearer calibration loops"],
    demoHref: "/demo/manager",
    demoLabel: "Explore Manager Demo",
  },
  {
    slug: "compliance",
    path: "/solutions/compliance",
    title: "Surface risky conversations faster.",
    subtitle:
      "Assist compliance teams by identifying calls that may require review — without claiming Artemis guarantees compliance.",
    seoTitle: "Compliance Assist | Artemis AI",
    seoDescription:
      "Help compliance teams identify sales conversations that may require review with AI-assisted flags and evidence.",
    points: [
      { title: "Risk language flags", body: "Highlight phrases and moments that may need human review." },
      { title: "Evidence links", body: "Jump straight to the transcript moment." },
      { title: "Review workflows", body: "Route flagged calls to the right reviewer." },
      { title: "Audit-friendly history", body: "Keep a trail of what was reviewed and why." },
      { title: "Policy prompts", body: "Remind agents of required language during live calls." },
    ],
    outcomes: [
      "Faster triage of potentially risky calls",
      "Less reliance on random sampling",
      "Clear separation between AI assist and human judgment",
    ],
    demoHref: "/demo",
    demoLabel: "Explore the Demo",
  },
  {
    slug: "training",
    path: "/solutions/training",
    title: "Train from real conversations, not generic scripts.",
    subtitle:
      "Roleplay, certifications, playbooks, and coaching loops built from what actually happens on your floor.",
    seoTitle: "Sales Training Solutions | Artemis AI",
    seoDescription:
      "Sales training with AI roleplay, certifications, adaptive playbooks, and coaching from real conversations.",
    points: [
      { title: "Scenario practice", body: "Roleplay the objections your team actually hears." },
      { title: "Certifications", body: "Gate campaigns until readiness standards are met." },
      { title: "Playbooks", body: "Teach from winning talk tracks." },
      { title: "Coaching loops", body: "Connect live misses to the next practice session." },
      { title: "Skill tracking", body: "Watch Rep DNA improve across a cohort." },
    ],
    outcomes: ["Faster ramp", "More consistent messaging", "Campaign-ready teams"],
    demoHref: "/demo/agent/practice",
    demoLabel: "Explore Practice Demo",
  },
];

export function getSolution(slug: string) {
  return SOLUTIONS.find((s) => s.slug === slug);
}
