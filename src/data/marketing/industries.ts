export type IndustryPage = {
  slug: string;
  path: string;
  name: string;
  title: string;
  subtitle: string;
  seoTitle: string;
  seoDescription: string;
  pains: string[];
  helps: { role: string; body: string }[];
  capabilities: { title: string; body: string }[];
  demoHref: string;
  demoLabel: string;
  featured?: boolean;
};

export const INDUSTRIES: IndustryPage[] = [
  {
    slug: "forex",
    path: "/industries/forex",
    name: "Forex & CFD",
    featured: true,
    title: "AI revenue intelligence for forex sales teams.",
    subtitle:
      "FTDs, deposits, desks, callbacks, withdrawal concerns, and coaching — built for high-volume forex sales floors.",
    seoTitle: "Forex Sales Intelligence | Artemis AI",
    seoDescription:
      "Artemis helps forex and CFD brokers improve FTD conversion, coach agents, and understand why deposits stall.",
    pains: [
      "Managers cannot review enough calls to coach consistently",
      "High-intent leads stall on trust and withdrawal concerns",
      "Desks produce volume without clear conversion diagnosis",
      "Compliance review depends on thin sampling",
    ],
    helps: [
      {
        role: "CEO",
        body: "See conversion, revenue at risk, lost reasons, and which desks need intervention.",
      },
      {
        role: "Manager",
        body: "Know who missed a close, which objections dominate today, and what to assign.",
      },
      {
        role: "Agent",
        body: "Get live guidance on trust objections and coaching immediately after the call.",
      },
    ],
    capabilities: [
      { title: "FTD & deposit focus", body: "Track conversion behavior tied to first-time funding conversations." },
      { title: "Desk operations", body: "Compare Alpha, Velocity, and other desks with consistent metrics." },
      { title: "Withdrawal objections", body: "Detect and coach the trust concerns that block deposits." },
      { title: "Callbacks & retention touches", body: "Keep follow-ups sharp when intent is still high." },
      { title: "Compliance assist", body: "Flag conversations that may need human review." },
      { title: "Agent coaching", body: "Improve closing when buying signals appear." },
    ],
    demoHref: "/demo",
    demoLabel: "Explore Forex Demo",
  },
  {
    slug: "insurance",
    path: "/industries/insurance",
    name: "Insurance",
    title: "Coach agents across high-volume insurance conversations.",
    subtitle:
      "Improve discovery, disclosure quality, and conversion across outbound and inbound insurance sales teams.",
    seoTitle: "Insurance Sales Intelligence | Artemis AI",
    seoDescription:
      "Conversation intelligence and coaching for high-volume insurance sales and service teams.",
    pains: [
      "Inconsistent discovery across large agent teams",
      "Hard to verify disclosure language at scale",
      "Managers sample too few calls",
    ],
    helps: [
      { role: "Managers", body: "Prioritize coaching where conversion and quality slip." },
      { role: "Agents", body: "Practice objections and get after-call coaching." },
      { role: "Leaders", body: "See which talk tracks and teams convert." },
    ],
    capabilities: [
      { title: "Call scoring", body: "Score discovery, clarity, and compliance-related language." },
      { title: "Playbooks", body: "Distribute approved responses for common objections." },
      { title: "Roleplay", body: "Certify agents before new campaigns." },
    ],
    demoHref: "/demo",
    demoLabel: "Explore the Demo",
  },
  {
    slug: "financial-services",
    path: "/industries/financial-services",
    name: "Financial Services",
    title: "Conversation intelligence for regulated financial sales.",
    subtitle:
      "Help teams improve conversion while keeping reviewable evidence for quality and compliance workflows.",
    seoTitle: "Financial Services Sales Intelligence | Artemis AI",
    seoDescription:
      "AI coaching and revenue intelligence for financial services sales organizations.",
    pains: [
      "High conversation volume with uneven coaching",
      "Need evidence for quality reviews",
      "Leaders see outcomes without behavioral drivers",
    ],
    helps: [
      { role: "Revenue leaders", body: "Understand conversion and risk across teams." },
      { role: "Managers", body: "Coach with transcript evidence." },
      { role: "QA", body: "Review the right calls faster." },
    ],
    capabilities: [
      { title: "Revenue intelligence", body: "Track conversion drivers across books of business." },
      { title: "Compliance assist", body: "Surface calls that may need review." },
      { title: "Coaching", body: "Improve consistency without listening to every recording." },
    ],
    demoHref: "/demo/ceo",
    demoLabel: "Explore CEO Demo",
  },
  {
    slug: "real-estate",
    path: "/industries/real-estate",
    name: "Real Estate",
    title: "Turn every property inquiry into sales intelligence.",
    subtitle:
      "Coach high-volume real estate sales conversations — from inquiry handling to follow-up discipline.",
    seoTitle: "Real Estate Sales Intelligence | Artemis AI",
    seoDescription:
      "Help real estate sales teams improve inquiry handling, follow-ups, and coaching with conversation intelligence.",
    pains: [
      "Inconsistent follow-up after inquiries",
      "Hard to coach large remote teams",
      "Lost context between calls",
    ],
    helps: [
      { role: "Agents", body: "Get better after every conversation with clear next actions." },
      { role: "Managers", body: "See who needs help and why." },
      { role: "Owners", body: "Understand what converts across locations." },
    ],
    capabilities: [
      { title: "Call intelligence", body: "Structure every inquiry conversation." },
      { title: "Next best action", body: "Keep follow-ups timely and specific." },
      { title: "Team visibility", body: "Compare performance without spreadsheet archaeology." },
    ],
    demoHref: "/demo",
    demoLabel: "Explore the Demo",
  },
  {
    slug: "bpo",
    path: "/industries/bpo",
    name: "BPO & Contact Centers",
    title: "Understand and improve performance across large contact-center teams.",
    subtitle:
      "Quality, coaching, and operational visibility for BPOs running high-volume sales or support programs.",
    seoTitle: "BPO & Contact Center Intelligence | Artemis AI",
    seoDescription:
      "Conversation intelligence for BPOs and contact centers — QA, coaching, and team performance at scale.",
    pains: [
      "Thousands of calls, thin QA sampling",
      "Client SLAs without behavioral insight",
      "Inconsistent agent coaching across shifts",
    ],
    helps: [
      { role: "Ops leaders", body: "See program health beyond raw handle time." },
      { role: "QA", body: "Review the right calls with AI-assisted queues." },
      { role: "Team leads", body: "Coach with evidence, not anecdotes." },
    ],
    capabilities: [
      { title: "QA queues", body: "Focus human review where risk or opportunity is highest." },
      { title: "Coaching", body: "Scale coaching across large agent populations." },
      { title: "Client reporting", body: "Explain performance with conversation evidence." },
    ],
    demoHref: "/demo/manager",
    demoLabel: "Explore Manager Demo",
  },
  {
    slug: "saas",
    path: "/industries/saas",
    name: "SaaS Sales",
    title: "Improve high-velocity SaaS conversations.",
    subtitle:
      "Outbound and inbound SaaS sales teams get live guidance, coaching, and clearer conversion diagnosis.",
    seoTitle: "SaaS Sales Intelligence | Artemis AI",
    seoDescription:
      "AI coaching and conversation intelligence for SaaS sales teams.",
    pains: [
      "SDR/AE inconsistency",
      "Missed qualification signals",
      "Managers buried in call recordings",
    ],
    helps: [
      { role: "SDRs & AEs", body: "Improve discovery and closing habits quickly." },
      { role: "Managers", body: "Coach from evidence across the team." },
      { role: "RevOps", body: "Connect conversation quality to pipeline outcomes." },
    ],
    capabilities: [
      { title: "Live guidance", body: "Assist during discovery and objection handling." },
      { title: "Revenue views", body: "See which behaviors correlate with conversion." },
      { title: "Roleplay", body: "Practice competitive and pricing objections." },
    ],
    demoHref: "/demo",
    demoLabel: "Explore the Demo",
  },
  {
    slug: "recruiting",
    path: "/industries/recruiting",
    name: "Recruiting",
    title: "Coach high-volume recruiting conversations.",
    subtitle:
      "Improve candidate and client conversations with structured call intelligence and coaching loops.",
    seoTitle: "Recruiting Conversation Intelligence | Artemis AI",
    seoDescription:
      "Help recruiting teams improve high-volume candidate and client conversations with AI coaching.",
    pains: [
      "Inconsistent screening quality",
      "Hard to coach large recruiter teams",
      "Lost context across touchpoints",
    ],
    helps: [
      { role: "Recruiters", body: "Get better after every conversation." },
      { role: "Team leads", body: "See who needs coaching and why." },
      { role: "Ops", body: "Standardize quality without micromanaging." },
    ],
    capabilities: [
      { title: "Call scoring", body: "Evaluate screening and client update quality." },
      { title: "Coaching", body: "Turn weak moments into practice." },
      { title: "Playbooks", body: "Share winning talk tracks across the team." },
    ],
    demoHref: "/demo",
    demoLabel: "Explore the Demo",
  },
  {
    slug: "telemarketing",
    path: "/industries/telemarketing",
    name: "Telemarketing",
    title: "Improve high-volume outbound telemarketing performance.",
    subtitle:
      "Guide agents live, coach after every call, and show managers where conversion is leaking.",
    seoTitle: "Telemarketing Intelligence | Artemis AI",
    seoDescription:
      "AI coaching and operations for high-volume telemarketing teams.",
    pains: [
      "Massive call volume, thin coaching",
      "Script drift across agents",
      "Unclear reasons for low conversion",
    ],
    helps: [
      { role: "Agents", body: "Stay on track with live prompts and after-call coaching." },
      { role: "Managers", body: "Intervene on the calls and agents that matter." },
      { role: "Leaders", body: "See conversion drivers across campaigns." },
    ],
    capabilities: [
      { title: "Live copilot", body: "Support high-velocity outbound conversations." },
      { title: "Campaign readiness", body: "Certify agents before new scripts go live." },
      { title: "Manager ops", body: "Run the floor from attention queues." },
    ],
    demoHref: "/demo/manager",
    demoLabel: "Explore Manager Demo",
  },
];

export function getIndustry(slug: string) {
  return INDUSTRIES.find((i) => i.slug === slug);
}
