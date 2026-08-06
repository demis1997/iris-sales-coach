// Dummy data for the Iris AI Revenue Operating System modules.

export type LiveAiCard = {
  at: string;
  trigger: string;
  kind: "objection" | "signal" | "question" | "close" | "risk";
  title: string;
  body: string;
  confidence: number;
};

export const liveTranscript = [
  { at: "00:12", who: "rep" as const, text: "Marcus, thanks for making time — how is the desk trading this week?" },
  { at: "00:41", who: "prospect" as const, text: "Busy. But honestly I'm not sure we need another platform." },
  { at: "01:20", who: "rep" as const, text: "Fair. What's the biggest gap between your top and bottom closers today?" },
  { at: "02:05", who: "prospect" as const, text: "Huge. My best guy closes 34%, the floor average is 19%." },
  { at: "03:38", who: "prospect" as const, text: "Look, it sounds good but it's expensive." },
  { at: "04:02", who: "rep" as const, text: "Understood — let me show you what 4 points of close rate is worth." },
];

export const liveAiCards: LiveAiCard[] = [
  {
    at: "00:41",
    trigger: '"I\'m not sure we need another platform"',
    kind: "objection",
    title: "Reframe as coaching capacity, not tooling",
    body: "Ask: how many of last month's calls did a manager actually review? Anchor on the 4% that get coached.",
    confidence: 91,
  },
  {
    at: "02:05",
    trigger: '"Best guy 34%, floor average 19%"',
    kind: "signal",
    title: "Quantified pain captured — 15pt spread",
    body: "This is your ROI anchor. Use it in the close: closing half the spread is €1.4M on their volume.",
    confidence: 96,
  },
  {
    at: "03:38",
    trigger: '"It\'s expensive"',
    kind: "objection",
    title: "Price justification play",
    body: "Do not discount. Convert to cost per rep per day (€6) and compare to one lost deal. Then offer a 30-day paid pilot on one team.",
    confidence: 94,
  },
  {
    at: "03:52",
    trigger: "Competitor mention: Gong",
    kind: "risk",
    title: "Competitor in the room",
    body: "Differentiate on real-time coaching during the call, not post-call review. Reference the Feldman case study.",
    confidence: 88,
  },
  {
    at: "04:10",
    trigger: "Buying intent rising",
    kind: "question",
    title: "Next best question",
    body: '"If we could lift the floor average by 4 points in a quarter, who else needs to be in the room to say yes?"',
    confidence: 92,
  },
  {
    at: "04:30",
    trigger: "Close window open",
    kind: "close",
    title: "Recommended close",
    body: "Propose a 2-team pilot starting Monday with a revenue review at day 30. Ask for the calendar now.",
    confidence: 87,
  },
];

export const dialPadQueue = [
  { name: "Yusuf Demir", company: "Aegean FX", tz: "GMT+3", intent: "High", attempts: 1 },
  { name: "Clara Lindqvist", company: "Nordvest Capital", tz: "GMT+1", intent: "Medium", attempts: 3 },
  { name: "Tom Whitfield", company: "Whitfield Trading", tz: "GMT", intent: "High", attempts: 0 },
  { name: "Rania Haddad", company: "Levant Markets", tz: "GMT+2", intent: "Low", attempts: 2 },
];

export const dispositions = [
  "Connected — demo booked",
  "Connected — follow up",
  "Not interested",
  "Voicemail",
  "Answering machine",
  "Wrong number",
  "Do not call",
];

export const campaigns = [
  { name: "Forex desks — EU tier 1", mode: "Predictive", leads: 4820, contacted: 3140, connect: 32, booked: 118, live: true },
  { name: "Reactivation Q3", mode: "Power", leads: 1960, contacted: 1712, connect: 27, booked: 54, live: true },
  { name: "Inbound callbacks", mode: "Progressive", leads: 640, contacted: 618, connect: 71, booked: 149, live: false },
];

// ── Revenue DNA ──────────────────────────────────────────────────────────────
export type DnaTrait = { label: string; value: number; grade: string; note: string };

export const revenueDna = {
  rep: "Alex Moreau",
  closingStyle: "Challenger",
  styleNote: "Reframes the prospect's thinking before pitching. Strongest on informed buyers.",
  percentile: "Top 5% of team",
  predictedPotential: 1_240_000,
  traits: [
    { label: "Trust building", value: 91, grade: "Elite", note: "Names risk before the prospect does." },
    { label: "Confidence", value: 87, grade: "Strong", note: "Voice steadies after objections." },
    { label: "Listening", value: 74, grade: "Developing", note: "Interrupts 3.1x per call on average." },
    { label: "Objection handling", value: 93, grade: "Elite", note: "Resolves 88% of objections first pass." },
    { label: "Price justification", value: 61, grade: "Needs work", note: "Discounts before value is anchored." },
    { label: "Discovery depth", value: 78, grade: "Strong", note: "Averages 5.4 discovery questions." },
    { label: "Urgency creation", value: 69, grade: "Developing", note: "Rarely sets a dated next step." },
    { label: "Closing", value: 84, grade: "Strong", note: "Asks for commitment on 79% of calls." },
  ] as DnaTrait[],
  coachingPlan: [
    { horizon: "Daily", action: "Pause 2 full seconds after every objection before responding." },
    { horizon: "Daily", action: "Anchor value before any number leaves your mouth." },
    { horizon: "Weekly", action: "Run one price-objection roleplay with Iris and score above 80." },
    { horizon: "Weekly", action: "Keep talk ratio under 52% on all discovery calls." },
    { horizon: "Monthly", action: "Lift listening score from 74 to 82 — target 1.5 interruptions per call." },
  ],
  dnaTrend: [
    { week: "W1", trust: 82, price: 48, listening: 63 },
    { week: "W2", trust: 84, price: 51, listening: 65 },
    { week: "W3", trust: 86, price: 54, listening: 66 },
    { week: "W4", trust: 87, price: 55, listening: 70 },
    { week: "W5", trust: 89, price: 58, listening: 71 },
    { week: "W6", trust: 90, price: 59, listening: 72 },
    { week: "W7", trust: 91, price: 61, listening: 74 },
  ],
};

export const teamDna = [
  { rep: "Alex Moreau", style: "Challenger", trust: 91, price: 61, close: 84, potential: "Top 5%" },
  { rep: "Sofia Rahman", style: "Consultative", trust: 88, price: 79, close: 81, potential: "Top 10%" },
  { rep: "Daniel Okoye", style: "Relationship", trust: 94, price: 52, close: 72, potential: "Top 25%" },
  { rep: "Mira Kovač", style: "Challenger", trust: 76, price: 84, close: 88, potential: "Top 5%" },
  { rep: "Jonas Berg", style: "Transactional", trust: 62, price: 47, close: 58, potential: "Bottom 20%" },
];

// ── CRM ──────────────────────────────────────────────────────────────────────
export const crmCompanies = [
  { name: "Feldman Capital", industry: "Forex broker", seats: 140, owner: "Alex Moreau", value: 186_000, health: "Strong" },
  { name: "Aegean FX", industry: "Forex broker", seats: 60, owner: "Sofia Rahman", value: 74_000, health: "At risk" },
  { name: "Nordvest Capital", industry: "Wealth", seats: 220, owner: "Mira Kovač", value: 310_000, health: "Strong" },
  { name: "Levant Markets", industry: "CFD", seats: 45, owner: "Daniel Okoye", value: 51_000, health: "Watch" },
];

export const crmContacts = [
  { name: "Marcus Feldman", title: "COO", company: "Feldman Capital", intent: 92, role: "Decision maker" },
  { name: "Yusuf Demir", title: "Head of Sales", company: "Aegean FX", intent: 78, role: "Champion" },
  { name: "Clara Lindqvist", title: "CFO", company: "Nordvest Capital", intent: 54, role: "Economic buyer" },
  { name: "Rania Haddad", title: "Sales Manager", company: "Levant Markets", intent: 41, role: "Influencer" },
];

export const pipeline = [
  {
    stage: "Discovery",
    deals: [
      { name: "Levant Markets — 45 seats", value: 51_000, win: 34, owner: "DO" },
      { name: "Aegean FX — expansion", value: 28_000, win: 41, owner: "SR" },
    ],
  },
  {
    stage: "Demo",
    deals: [
      { name: "Nordvest Capital — 220 seats", value: 310_000, win: 58, owner: "MK" },
    ],
  },
  {
    stage: "Proposal",
    deals: [
      { name: "Feldman Capital — 140 seats", value: 186_000, win: 78, owner: "AM" },
      { name: "Whitfield Trading — 30 seats", value: 36_000, win: 62, owner: "AM" },
    ],
  },
  {
    stage: "Negotiation",
    deals: [{ name: "Aegean FX — 60 seats", value: 74_000, win: 66, owner: "SR" }],
  },
  {
    stage: "Closed won",
    deals: [{ name: "Meridian Brokers — 90 seats", value: 121_000, win: 100, owner: "MK" }],
  },
];

export const crmTasks = [
  { task: "Send objection recap to Marcus", due: "Today 17:00", owner: "AM", source: "AI generated" },
  { task: "Book technical call — Nordvest", due: "Tomorrow", owner: "MK", source: "AI generated" },
  { task: "Refund policy answer — Levant", due: "Thu", owner: "DO", source: "Workflow" },
];

// ── Workflow automation ──────────────────────────────────────────────────────
export const workflows = [
  {
    name: "Refund mention → retention play",
    trigger: 'Conversation mentions "refund"',
    runs: 214,
    active: true,
    steps: ["Create retention ticket", "Notify #cs-alerts in Slack", "Update CRM deal risk", "Email retention offer", "Create follow-up task"],
  },
  {
    name: "Competitor mention → battlecard",
    trigger: "Competitor detected on call",
    runs: 486,
    active: true,
    steps: ["Push battlecard to rep", "Tag deal 'competitive'", "Notify manager", "Schedule coaching"],
  },
  {
    name: "High intent → fast track",
    trigger: "Buying intent above 85",
    runs: 132,
    active: true,
    steps: ["Move deal to Proposal", "Generate proposal draft", "Book follow-up in 24h"],
  },
  {
    name: "Compliance risk → QA review",
    trigger: "Compliance flag raised",
    runs: 37,
    active: false,
    steps: ["Lock recording", "Assign QA reviewer", "Notify compliance officer", "Log audit entry"],
  },
];

// ── Roleplay ─────────────────────────────────────────────────────────────────
export const roleplayScenarios = [
  { name: "Angry customer", level: "Hard", desc: "Escalated refund demand after a losing week.", best: 71 },
  { name: "Enterprise buyer", level: "Hard", desc: "Procurement-led, security and SOC2 questions.", best: 84 },
  { name: "Cold lead", level: "Medium", desc: "No context, 12 seconds to earn the meeting.", best: 78 },
  { name: "Difficult prospect", level: "Hard", desc: "Interrupts, tests authority, dismissive.", best: 66 },
  { name: "Price objection", level: "Medium", desc: '"You are 40% more than the alternative."', best: 88 },
  { name: "Competitor comparison", level: "Medium", desc: "Already trialling a rival platform.", best: 74 },
];

// ── Manager / admin ──────────────────────────────────────────────────────────
export const liveFloor = [
  { rep: "Alex Moreau", state: "On call", prospect: "Feldman Capital", min: 12, sentiment: "Positive", risk: false },
  { rep: "Sofia Rahman", state: "On call", prospect: "Aegean FX", min: 4, sentiment: "Neutral", risk: true },
  { rep: "Daniel Okoye", state: "Wrap-up", prospect: "Levant Markets", min: 1, sentiment: "Negative", risk: true },
  { rep: "Mira Kovač", state: "Dialing", prospect: "—", min: 0, sentiment: "—", risk: false },
  { rep: "Jonas Berg", state: "Break", prospect: "—", min: 0, sentiment: "—", risk: false },
];

export const qaQueue = [
  { call: "Aegean FX · Yusuf Demir", rep: "Sofia Rahman", flag: "Risk disclosure missing", severity: "High" },
  { call: "Levant Markets · Rania Haddad", rep: "Daniel Okoye", flag: "Guaranteed returns language", severity: "Critical" },
  { call: "Whitfield Trading · Tom W.", rep: "Alex Moreau", flag: "Recording notice late", severity: "Low" },
];

export const adminCompanies = [
  { company: "Feldman Capital", plan: "Enterprise", seats: 140, mrr: 15_400, minutes: 84_200, health: "Healthy" },
  { company: "Nordvest Capital", plan: "Professional", seats: 220, mrr: 19_800, minutes: 132_900, health: "Healthy" },
  { company: "Aegean FX", plan: "Growth", seats: 60, mrr: 4_800, minutes: 31_400, health: "Watch" },
  { company: "Levant Markets", plan: "Starter", seats: 45, mrr: 2_250, minutes: 12_100, health: "Trial" },
];

export const platformUsage = [
  { label: "AI tokens", value: "42.8M", hint: "this month" },
  { label: "Call minutes", value: "260,600", hint: "across 4 companies" },
  { label: "API requests", value: "1.94M", hint: "p95 latency 118ms" },
  { label: "Storage", value: "3.4 TB", hint: "recordings + transcripts" },
];
