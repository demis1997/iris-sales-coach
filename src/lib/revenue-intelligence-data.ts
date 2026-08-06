/**
 * Connected demo data for Iris AI Revenue Intelligence.
 * IDs link to existing campaigns, reps, deals, and calls — not orphaned mock screens.
 * Integration points for production AI/telephony are marked with // INTEGRATION:
 */

export type SkillKey =
  | "Confidence"
  | "Listening"
  | "Empathy"
  | "Discovery"
  | "Qualification"
  | "Product knowledge"
  | "Storytelling"
  | "Rapport"
  | "Question quality"
  | "Objection handling"
  | "Negotiation"
  | "Price justification"
  | "Urgency creation"
  | "Closing"
  | "Compliance"
  | "Follow-up discipline"
  | "Coachability"
  | "Consistency";

export type SkillScore = {
  key: SkillKey;
  score: number;
  previous: number;
  teamAvg: number;
  topBenchmark: number;
  grade: "Elite" | "Strong" | "Developing" | "Needs work";
  trend: number[];
  evidenceCallId: string;
  evidenceNote: string;
  explanation: string;
  exercise: string;
  revenueImpactEur: number;
};

export type AgentDnaProfile = {
  agentId: string;
  name: string;
  team: string;
  managerId: string;
  closingStyle: string;
  styleNote: string;
  percentile: string;
  predictedPotential: number;
  certifications: string[];
  skills: SkillScore[];
};

export const callStagesTrack = [
  "Opening",
  "Discovery",
  "Qualification",
  "Pitch",
  "Objection handling",
  "Close",
  "Next steps",
] as const;

export type LiveCoachSuggestion = {
  id: string;
  at: string;
  trigger: string;
  kind: "objection" | "signal" | "question" | "close" | "risk" | "compliance" | "battlecard";
  detected: string;
  suggestedResponse: string;
  whyItWorks: string;
  confidence: number;
  source: string;
  campaign: string;
  dealId: string;
  supporting: { label: string; detail: string }[];
  alternatives: string[];
  battleCard?: { competitor: string; points: string[] };
};

/** Richer live coaching cards for Feldman Capital call (links to campaign + deal). */
export const liveCoachSession = {
  callId: "c-1841",
  contact: "Marcus Feldman",
  company: "Feldman Capital",
  dealId: "deal-feldman-140",
  campaign: "Forex desks — EU tier 1",
  playbook: "Enterprise forex discovery v3",
  metrics: {
    sentiment: 72,
    buyingIntent: 81,
    talkListen: 48,
    agentConfidence: 79,
    dealRisk: 34,
    stageIndex: 4,
  },
  skippedWarnings: ["Confirm decision timeline before pitching pricing tiers"],
  checklist: [
    { label: "Recording consent stated", done: true },
    { label: "Budget range confirmed", done: true },
    { label: "Authority identified", done: true },
    { label: "Timeline / next step dated", done: false },
    { label: "Competitor landscape mapped", done: true },
    { label: "ROI anchor spoken", done: false },
  ],
  suggestions: [
    {
      id: "sug-1",
      at: "03:38",
      trigger: '"Your competitor is cheaper."',
      kind: "objection" as const,
      detected: "Price comparison",
      suggestedResponse:
        "I understand. Apart from price, which parts of their offer are most important to you?",
      whyItWorks:
        "It identifies the customer’s decision criteria before offering a discount. Closed-won calls that asked this first converted 21% more often on this campaign.",
      confidence: 94,
      source: "Playbook · Price objection · Top-rep DNA (Mira Kovač)",
      campaign: "Forex desks — EU tier 1",
      dealId: "deal-feldman-140",
      supporting: [
        { label: "ROI calculation", detail: "4pt close-rate lift on their volume ≈ €1.4M annual" },
        { label: "Approved pricing", detail: "€6 per seat/day — do not discount before ROI anchor" },
        { label: "Success story", detail: "Feldman peer: Meridian Brokers +9pt floor average in 90 days" },
        { label: "Follow-up question", detail: "Who else needs to see the ROI before a yes?" },
      ],
      alternatives: [
        "Happy to compare apples-to-apples — what number are they quoting, and what’s included?",
        "Price is one lever. If we held price flat, what would make this a clear win for your desk?",
      ],
      battleCard: {
        competitor: "Gong",
        points: [
          "Gong = post-call review; Iris = live coaching during the call",
          "Revenue DNA + certification gates before campaign dialer access",
          "Deal-risk + next-best-action written back to CRM automatically",
        ],
      },
    },
    {
      id: "sug-2",
      at: "02:05",
      trigger: '"Best guy 34%, floor average 19%"',
      kind: "signal" as const,
      detected: "Quantified performance gap",
      suggestedResponse:
        "That’s a 15-point spread. If we closed even half of it on your volume, what would that mean in revenue this quarter?",
      whyItWorks: "Turns their own numbers into the ROI anchor before product talk.",
      confidence: 96,
      source: "Closed-won pattern · 48 similar deals",
      campaign: "Forex desks — EU tier 1",
      dealId: "deal-feldman-140",
      supporting: [
        { label: "CRM history", detail: "Marcus viewed pricing page twice this week" },
        { label: "Prior call", detail: "c-1832 — mentioned manager bandwidth as bottleneck" },
      ],
      alternatives: [
        "Walk me through how you coach the bottom quartile today — how many calls get reviewed?",
      ],
    },
    {
      id: "sug-3",
      at: "04:10",
      trigger: "Buying intent rising",
      kind: "close" as const,
      detected: "Close window",
      suggestedResponse:
        "Let’s start a two-team pilot Monday with a revenue review on day 30. Can we lock that on your calendar now?",
      whyItWorks: "Dated next step + limited pilot reduces procurement friction.",
      confidence: 87,
      source: "Campaign playbook · Close stage",
      campaign: "Forex desks — EU tier 1",
      dealId: "deal-feldman-140",
      supporting: [{ label: "Missing", detail: "Timeline still unchecked on playbook checklist" }],
      alternatives: ["Would Thursday work for a 20-minute kickoff with your top two team leads?"],
    },
  ] satisfies LiveCoachSuggestion[],
};

const skill = (
  key: SkillKey,
  score: number,
  previous: number,
  teamAvg: number,
  topBenchmark: number,
  grade: SkillScore["grade"],
  evidenceCallId: string,
  evidenceNote: string,
  explanation: string,
  exercise: string,
  revenueImpactEur: number,
  trend: number[],
): SkillScore => ({
  key,
  score,
  previous,
  teamAvg,
  topBenchmark,
  grade,
  trend,
  evidenceCallId,
  evidenceNote,
  explanation,
  exercise,
  revenueImpactEur,
});

export const agentDnaProfiles: AgentDnaProfile[] = [
  {
    agentId: "e-01",
    name: "Alex Moreau",
    team: "Forex Desk",
    managerId: "mgr-sofia",
    closingStyle: "Challenger",
    styleNote: "Reframes the prospect’s thinking before pitching. Strongest on informed buyers.",
    percentile: "Top 5% of team",
    predictedPotential: 1_240_000,
    certifications: ["Product", "Discovery"],
    skills: [
      skill("Confidence", 87, 84, 74, 93, "Strong", "c-1841", "Voice steadies after objections", "Maintains composure; slight drop when price is challenged early.", "Record three price-objection opens and self-score confidence at second 10.", 42000, [80, 82, 83, 84, 85, 86, 87]),
      skill("Listening", 74, 70, 71, 91, "Developing", "c-1838", "3.1 interruptions/call", "You frequently begin presenting before confirming budget, decision authority, and timeline. Deals where these were confirmed converted 21% more often.", "Complete three advanced discovery roleplays; use discovery checklist on next five calls.", 86000, [63, 65, 66, 68, 70, 72, 74]),
      skill("Empathy", 81, 79, 76, 92, "Strong", "c-1840", "Names risk before prospect does", "Strong trust language; occasionally over-agrees before probing.", "Practice one reflective summary before every pitch.", 18000, [75, 76, 77, 78, 79, 80, 81]),
      skill("Discovery", 64, 61, 70, 94, "Needs work", "c-1835", "Pitched before BANT complete", "You frequently begin presenting before confirming budget, authority, and timeline.", "Complete three advanced discovery roleplays and use the discovery checklist on your next five calls.", 124000, [55, 57, 58, 60, 61, 62, 64]),
      skill("Qualification", 71, 68, 72, 90, "Developing", "c-1839", "Authority confirmed late", "Economic buyer often missing until proposal.", "Ask ‘who else signs off?’ before demo.", 54000, [62, 64, 65, 67, 68, 70, 71]),
      skill("Product knowledge", 88, 86, 80, 95, "Strong", "c-1841", "Accurate feature mapping", "Solid; avoid inventing roadmap items.", "Review KB pricing FAQ weekly.", 12000, [82, 83, 84, 85, 86, 87, 88]),
      skill("Storytelling", 76, 74, 69, 89, "Strong", "c-1837", "Meridian case used well", "Stories land; tie earlier to quantified pain.", "Open with customer outcome metric.", 22000, [70, 71, 72, 73, 74, 75, 76]),
      skill("Rapport", 85, 83, 77, 93, "Strong", "c-1841", "Warm open", "Consistent.", "Keep personal callback notes in CRM.", 9000, [80, 81, 82, 83, 84, 84, 85]),
      skill("Question quality", 69, 66, 71, 92, "Developing", "c-1835", "Too many closed questions", "Shift to situational + implication questions.", "Roleplay SPIN sequence ×3.", 48000, [60, 62, 63, 65, 66, 67, 69]),
      skill("Objection handling", 93, 90, 72, 96, "Elite", "c-1841", "Resolves 88% first pass", "Elite reframes; do not discount early.", "Mentor Jonas on price objections.", 0, [86, 88, 89, 90, 91, 92, 93]),
      skill("Negotiation", 72, 70, 68, 88, "Developing", "c-1836", "Conceded seats too fast", "Hold value before commercial concessions.", "Practice BATNA framing roleplay.", 37000, [65, 66, 67, 68, 69, 70, 72]),
      skill("Price justification", 61, 55, 64, 90, "Needs work", "c-1838", "Discounted before value anchor", "Discounts before value is anchored.", "Run one price-objection roleplay weekly; score ≥80.", 98000, [48, 51, 54, 55, 58, 59, 61]),
      skill("Urgency creation", 69, 67, 66, 87, "Developing", "c-1840", "Rarely sets dated next step", "Close windows slip without dates.", "Always propose a calendar hold before wrap.", 41000, [60, 62, 63, 65, 66, 67, 69]),
      skill("Closing", 84, 82, 73, 94, "Strong", "c-1841", "Asks on 79% of calls", "Strong ask rate; pair with timeline.", "Trial soft close after ROI anchor.", 15000, [78, 79, 80, 81, 82, 83, 84]),
      skill("Compliance", 91, 90, 88, 98, "Elite", "c-1841", "Consent + risk language clean", "Consistent.", "Stay current on disclosure script v4.", 0, [88, 89, 89, 90, 90, 91, 91]),
      skill("Follow-up discipline", 77, 74, 70, 91, "Strong", "c-1839", "CRM tasks completed 86%", "Good; same-day notes improve win rate.", "Approve AI CRM draft within 1h of hangup.", 28000, [70, 71, 72, 73, 74, 75, 77]),
      skill("Coachability", 89, 85, 76, 95, "Strong", "roleplay-12", "Implements feedback in <7 days", "High.", "Keep weekly plan completion >90%.", 8000, [80, 82, 83, 85, 86, 87, 89]),
      skill("Consistency", 82, 80, 74, 92, "Strong", "c-1841", "Score variance ±6", "Stable week to week.", "Protect morning high-intent blocks.", 11000, [76, 77, 78, 79, 80, 81, 82]),
    ],
  },
  {
    agentId: "e-02",
    name: "Sofia Rahman",
    team: "Forex Desk",
    managerId: "mgr-sofia",
    closingStyle: "Consultative",
    styleNote: "Deep discovery, measured closes. Strong on complex multi-stakeholder deals.",
    percentile: "Top 10% of team",
    predictedPotential: 980_000,
    certifications: ["Product", "Compliance", "Objection-handling"],
    skills: [
      skill("Discovery", 88, 85, 70, 94, "Elite", "c-1820", "Full MEDDIC", "Elite discovery.", "Peer-coach Alex on discovery checklist.", 0, [80, 82, 84, 85, 86, 87, 88]),
      skill("Price justification", 79, 74, 64, 90, "Strong", "c-1821", "ROI first", "Improved after coaching.", "Keep ROI worksheet open on every proposal call.", 22000, [60, 64, 68, 70, 74, 76, 79]),
      skill("Objection handling", 81, 78, 72, 96, "Strong", "c-1822", "—", "Solid.", "Advanced competitor battlecard drill.", 14000, [72, 74, 75, 76, 78, 79, 81]),
      skill("Listening", 86, 84, 71, 91, "Strong", "c-1820", "—", "Strong.", "Maintain.", 5000, [80, 81, 82, 83, 84, 85, 86]),
      skill("Closing", 81, 79, 73, 94, "Strong", "c-1823", "—", "Strong.", "Add dated next step every time.", 9000, [74, 75, 76, 77, 78, 79, 81]),
      skill("Compliance", 96, 95, 88, 98, "Elite", "c-1821", "—", "Elite.", "Lead compliance huddles.", 0, [93, 94, 94, 95, 95, 96, 96]),
    ],
  },
  {
    agentId: "e-03",
    name: "Daniel Okoye",
    team: "CFD Desk",
    managerId: "mgr-sofia",
    closingStyle: "Relationship",
    styleNote: "High trust, slower commercial progression.",
    percentile: "Top 25% of team",
    predictedPotential: 640_000,
    certifications: ["Product"],
    skills: [
      skill("Rapport", 94, 92, 77, 93, "Elite", "c-1810", "—", "Elite rapport.", "Pair with urgency drills.", 0, [90, 91, 91, 92, 93, 93, 94]),
      skill("Urgency creation", 52, 50, 66, 87, "Needs work", "c-1811", "No dated next step", "Deals stall in proposal.", "Mandatory calendar ask checklist.", 76000, [48, 49, 50, 50, 51, 51, 52]),
      skill("Closing", 72, 70, 73, 94, "Developing", "c-1812", "—", "Needs firmer asks.", "Closing certification path.", 41000, [65, 66, 68, 69, 70, 71, 72]),
      skill("Compliance", 68, 71, 88, 98, "Needs work", "c-1815", "Guaranteed returns language", "Critical QA flag — recertify compliance.", "Compliance certification before dialer unlock.", 0, [74, 73, 72, 71, 70, 69, 68]),
      skill("Discovery", 77, 75, 70, 94, "Strong", "c-1810", "—", "Good.", "Keep.", 8000, [70, 71, 72, 73, 74, 75, 77]),
      skill("Objection handling", 70, 68, 72, 96, "Developing", "c-1813", "—", "Average.", "Price objection roleplays ×5.", 29000, [64, 65, 66, 67, 68, 69, 70]),
    ],
  },
  {
    agentId: "e-04",
    name: "Mira Kovač",
    team: "Wealth Desk",
    managerId: "mgr-elena",
    closingStyle: "Challenger",
    styleNote: "Top closer. Source of Top-Rep DNA patterns for price and urgency.",
    percentile: "Top 5% of team",
    predictedPotential: 1_520_000,
    certifications: ["Product", "Campaign", "Closing", "Objection-handling"],
    skills: [
      skill("Closing", 94, 92, 73, 94, "Elite", "c-1801", "—", "Benchmark closer.", "Record best-practice clips for playbook.", 0, [88, 89, 90, 91, 92, 93, 94]),
      skill("Price justification", 91, 88, 64, 90, "Elite", "c-1802", "—", "Never discounts before ROI.", "Contribute battlecard updates.", 0, [82, 84, 86, 87, 88, 90, 91]),
      skill("Objection handling", 96, 94, 72, 96, "Elite", "c-1803", "—", "Top-Rep DNA source.", "Mentor sessions Thu.", 0, [90, 91, 92, 93, 94, 95, 96]),
      skill("Discovery", 90, 88, 70, 94, "Elite", "c-1801", "—", "Elite.", "Keep.", 0, [84, 85, 86, 87, 88, 89, 90]),
      skill("Listening", 88, 86, 71, 91, "Strong", "c-1802", "—", "Strong.", "Keep.", 0, [82, 83, 84, 85, 86, 87, 88]),
      skill("Urgency creation", 89, 86, 66, 87, "Elite", "c-1804", "—", "Dated next steps always.", "Share template.", 0, [80, 82, 84, 85, 86, 87, 89]),
    ],
  },
  {
    agentId: "e-05",
    name: "Jonas Berg",
    team: "Forex Desk",
    managerId: "mgr-sofia",
    closingStyle: "Transactional",
    styleNote: "High activity, low conversion. Priority coaching target.",
    percentile: "Bottom 20% of team",
    predictedPotential: 280_000,
    certifications: [],
    skills: [
      skill("Discovery", 48, 45, 70, 94, "Needs work", "c-1790", "Pitch in first 90s", "Skips qualification.", "Locked from Predictive campaign until Discovery cert.", 156000, [42, 43, 44, 45, 46, 47, 48]),
      skill("Objection handling", 41, 38, 72, 96, "Needs work", "c-1791", "Freezes on price", "Primary coaching focus.", "Daily price-objection roleplay.", 142000, [35, 36, 37, 38, 39, 40, 41]),
      skill("Listening", 55, 52, 71, 91, "Needs work", "c-1792", "High interruptions", "Talk ratio 68%.", "Talk-listen meter goal <52%.", 67000, [48, 49, 50, 51, 52, 53, 55]),
      skill("Closing", 58, 55, 73, 94, "Needs work", "c-1793", "Soft asks", "Needs certification.", "Closing fundamentals lesson.", 54000, [50, 51, 52, 53, 54, 55, 58]),
      skill("Compliance", 82, 80, 88, 98, "Strong", "c-1790", "—", "OK.", "Maintain.", 0, [78, 79, 80, 80, 81, 81, 82]),
      skill("Coachability", 71, 65, 76, 95, "Developing", "roleplay-03", "Improving", "Responding to plan.", "Keep streak.", 12000, [58, 60, 62, 64, 66, 68, 71]),
    ],
  },
];

export const coachingPlans = [
  {
    id: "plan-alex-price",
    agentId: "e-01",
    agent: "Alex Moreau",
    focus: "Handling price objections",
    status: "Active",
    daily: "Pause 2 seconds after every price objection; ask decision-criteria question before any number.",
    weekly: "One price-objection roleplay ≥80; keep discovery talk ratio <52%.",
    monthly: "Lift Price justification 61→75; Listening 74→82.",
    reviewCalls: ["c-1838", "c-1841"],
    roleplays: ["Price objection", "Competitor comparison"],
    lessons: ["ROI anchoring without discounting"],
    managerAction: "Shadow one proposal call this week (Sofia).",
    completion: 62,
    beforeScore: 41,
    afterScore: 68,
    businessOutcome: "12% improvement in meeting-booked rate on Forex desks campaign",
    criteria: "Price justification ≥75 and 5 consecutive calls with dated next step",
  },
  {
    id: "plan-jonas-discovery",
    agentId: "e-05",
    agent: "Jonas Berg",
    focus: "Discovery before pitch",
    status: "Active",
    daily: "Complete campaign discovery checklist before any product claim.",
    weekly: "Three advanced discovery roleplays; review two lost deals with manager.",
    monthly: "Earn Discovery certification; unlock Predictive dialer.",
    reviewCalls: ["c-1790", "c-1791"],
    roleplays: ["Cold prospect", "Busy executive"],
    lessons: ["MEDDIC fundamentals", "Question quality"],
    managerAction: "Block Predictive campaign access until cert passed.",
    completion: 28,
    beforeScore: 38,
    afterScore: 48,
    businessOutcome: "Early signal: talk ratio down 9pts on coached calls",
    criteria: "Discovery cert passed + score ≥70 on 5 live calls",
  },
  {
    id: "plan-daniel-urgency",
    agentId: "e-03",
    agent: "Daniel Okoye",
    focus: "Urgency and compliance",
    status: "Active",
    daily: "Propose calendar hold before wrap on every connected call.",
    weekly: "Compliance recertification module + 2 roleplays.",
    monthly: "Urgency 52→70; Compliance ≥90.",
    reviewCalls: ["c-1811", "c-1815"],
    roleplays: ["Compliance-sensitive conversation"],
    lessons: ["Disclosure script v4"],
    managerAction: "QA review all CFD Desk calls this week.",
    completion: 45,
    beforeScore: 50,
    afterScore: 58,
    businessOutcome: "Pending — measuring after cert",
    criteria: "Compliance cert + urgency score ≥70",
  },
  {
    id: "plan-sofia-mentor",
    agentId: "e-02",
    agent: "Sofia Rahman",
    focus: "Peer coaching leverage",
    status: "Active",
    daily: "Log one coaching note for a teammate.",
    weekly: "Run discovery clinic for Jonas + Alex.",
    monthly: "Contribute 2 playbook recommendations from closed-won calls.",
    reviewCalls: ["c-1820"],
    roleplays: ["Enterprise decision-maker"],
    lessons: ["Manager coaching frameworks"],
    managerAction: "Promote to trainer role on Discovery cert.",
    completion: 80,
    beforeScore: 85,
    afterScore: 88,
    businessOutcome: "Team discovery average +6pts in 30 days",
    criteria: "2 approved playbook updates",
  },
  {
    id: "plan-mira-toprep",
    agentId: "e-04",
    agent: "Mira Kovač",
    focus: "Codify Top-Rep DNA",
    status: "Completed",
    daily: "Tag winning moments for playbook mining.",
    weekly: "Record one best-practice clip.",
    monthly: "Publish price-justification pattern pack.",
    reviewCalls: ["c-1801", "c-1802"],
    roleplays: [],
    lessons: [],
    managerAction: "Approve playbook recommendations from Mira patterns.",
    completion: 100,
    beforeScore: 90,
    afterScore: 94,
    businessOutcome: "Coaching-influenced revenue €186k attributed this quarter",
    criteria: "Pattern pack live in Live Coach",
  },
  {
    id: "plan-alex-listen",
    agentId: "e-01",
    agent: "Alex Moreau",
    focus: "Listening & interruptions",
    status: "Queued",
    daily: "Interruptions ≤1.5 per call.",
    weekly: "Review two calls where pitch started early.",
    monthly: "Listening 74→82.",
    reviewCalls: ["c-1835"],
    roleplays: ["Skeptical buyer"],
    lessons: ["Active listening drills"],
    managerAction: "Check mid-week meter.",
    completion: 0,
    beforeScore: 74,
    afterScore: 74,
    businessOutcome: "Not started",
    criteria: "Listening ≥82 for two consecutive weeks",
  },
];

export const dealIntelligence = [
  {
    id: "deal-feldman-140",
    name: "Feldman Capital — 140 seats",
    ownerId: "e-01",
    owner: "Alex Moreau",
    stage: "Proposal",
    value: 186_000,
    winProbability: 78,
    previousWin: 72,
    risk: "Medium" as const,
    forecast: "Commit",
    confidence: 84,
    campaign: "Forex desks — EU tier 1",
    contactId: "Marcus Feldman",
    positive: ["Budget confirmed", "Champion engaged", "ROI discussed"],
    negative: ["Timeline not dated", "Procurement not involved yet"],
    missing: ["Decision date", "Security questionnaire"],
    risks: {
      stakeholder: 40,
      competitor: 55,
      pricing: 35,
      engagement: 25,
      followUp: 45,
    },
    timeline: [
      { when: "Mon", win: 72, reason: "Demo completed; sentiment positive" },
      { when: "Wed", win: 78, reason: "Price objection reframed with ROI; intent ↑" },
      { when: "Thu", win: 78, reason: "Awaiting calendar hold for pilot kickoff" },
    ],
    nextBestActions: [
      {
        id: "nba-1",
        action: "Lock pilot kickoff on calendar within 24 hours",
        rationale: "Timeline still missing — deals without dated next step close 19% less often",
        due: "Tomorrow",
        status: "Open" as const,
      },
      {
        id: "nba-2",
        action: "Send approved ROI comparison (no discount)",
        rationale: "Competitor price mention detected; battlecard ready",
        due: "Today",
        status: "Open" as const,
      },
      {
        id: "nba-3",
        action: "Do not offer a discount yet",
        rationale: "Price justification DNA still building; early discount correlated with −14% ACV",
        due: "Ongoing",
        status: "Open" as const,
      },
    ],
    outcomeCrm: {
      summary: "Marcus confirmed a 15pt close-rate gap and openness to a two-team pilot if ROI is clear.",
      goals: ["Lift floor close rate", "Reduce manager review burden"],
      painPoints: ["Inconsistent coaching coverage", "Tool sprawl"],
      budget: "Confirmed mid-six figures annually",
      authority: "Marcus (COO) — economic buyer likely CFO Clara later",
      timeline: "Wants progress this quarter — date not locked",
      competitors: ["Gong"],
      objections: ["Price vs competitor"],
      buyingIntent: 81,
      dealRisk: 34,
      probability: 78,
      probabilityWhy: "Intent up after ROI reframe; timeline risk remains",
      suggestedEmail:
        "Marcus — capturing the ROI math from today and two pilot kickoff slots for Monday/Tuesday…",
      suggestedFollowUp: "Call within 24 hours",
    },
  },
  {
    id: "deal-aegean-60",
    name: "Aegean FX — 60 seats",
    ownerId: "e-02",
    owner: "Sofia Rahman",
    stage: "Negotiation",
    value: 74_000,
    winProbability: 54,
    previousWin: 72,
    risk: "High" as const,
    forecast: "Upside",
    confidence: 71,
    campaign: "Reactivation Q3",
    contactId: "Yusuf Demir",
    positive: ["Champion active"],
    negative: ["Competitor cheaper", "Follow-up delayed 4 days", "No decision date", "Economic buyer absent"],
    missing: ["CFO on call", "Decision date"],
    risks: { stakeholder: 70, competitor: 80, pricing: 75, engagement: 60, followUp: 85 },
    timeline: [
      { when: "Week −2", win: 72, reason: "Strong discovery" },
      { when: "Week −1", win: 66, reason: "Competitor introduced" },
      { when: "Now", win: 54, reason: "Follow-up lag + no economic buyer" },
    ],
    nextBestActions: [
      {
        id: "nba-a1",
        action: "Invite financial decision-maker and send approved ROI comparison before Friday",
        rationale: "Win probability dropped 72→54 for these exact reasons",
        due: "Friday",
        status: "Open" as const,
      },
      {
        id: "nba-a2",
        action: "Escalate to manager for multi-thread strategy",
        rationale: "Single-threaded deal with high competitor risk",
        due: "Today",
        status: "Open" as const,
      },
    ],
    outcomeCrm: {
      summary: "Yusuf is engaged but citing a cheaper competitor; follow-up slipped four days.",
      goals: ["Replace current stack"],
      painPoints: ["Cost", "Agent idle time"],
      budget: "Sensitive — comparing quotes",
      authority: "Yusuf champion; CFO not engaged",
      timeline: "Unknown",
      competitors: ["Local dialer vendor"],
      objections: ["Price"],
      buyingIntent: 48,
      dealRisk: 72,
      probability: 54,
      probabilityWhy: "Competitor + delayed follow-up + missing economic buyer",
      suggestedEmail: "Yusuf — sharing a side-by-side ROI with your current connect rates…",
      suggestedFollowUp: "Escalate + CFO invite this week",
    },
  },
  {
    id: "deal-nordvest-220",
    name: "Nordvest Capital — 220 seats",
    ownerId: "e-04",
    owner: "Mira Kovač",
    stage: "Demo",
    value: 310_000,
    winProbability: 58,
    previousWin: 55,
    risk: "Medium" as const,
    forecast: "Pipeline",
    confidence: 76,
    campaign: "Forex desks — EU tier 1",
    contactId: "Clara Lindqvist",
    positive: ["Security interest", "Large ACV"],
    negative: ["Long cycle"],
    missing: ["Technical validation"],
    risks: { stakeholder: 50, competitor: 30, pricing: 40, engagement: 35, followUp: 30 },
    timeline: [{ when: "Now", win: 58, reason: "Demo scheduled" }],
    nextBestActions: [
      {
        id: "nba-n1",
        action: "Schedule product demonstration with security + sales ops",
        rationale: "Enterprise path requires technical validation",
        due: "This week",
        status: "Open" as const,
      },
    ],
    outcomeCrm: {
      summary: "CFO Clara evaluating; wants security and ROI depth.",
      goals: ["Enterprise rollout"],
      painPoints: ["Fragmented tools"],
      budget: "Board-approved exploration",
      authority: "Clara CFO",
      timeline: "This half",
      competitors: [],
      objections: [],
      buyingIntent: 54,
      dealRisk: 42,
      probability: 58,
      probabilityWhy: "Early but expanding stakeholders correctly",
      suggestedEmail: "Clara — proposing a technical demo agenda…",
      suggestedFollowUp: "Book multi-thread demo",
    },
  },
  {
    id: "deal-levant-45",
    name: "Levant Markets — 45 seats",
    ownerId: "e-03",
    owner: "Daniel Okoye",
    stage: "Discovery",
    value: 51_000,
    winProbability: 34,
    previousWin: 40,
    risk: "High" as const,
    forecast: "Pipeline",
    confidence: 62,
    campaign: "Inbound callbacks",
    contactId: "Rania Haddad",
    positive: ["Inbound intent"],
    negative: ["Low urgency", "Compliance language risk on prior call"],
    missing: ["Budget", "Authority"],
    risks: { stakeholder: 65, competitor: 40, pricing: 50, engagement: 55, followUp: 50 },
    timeline: [{ when: "Now", win: 34, reason: "Incomplete discovery" }],
    nextBestActions: [
      {
        id: "nba-l1",
        action: "Complete discovery checklist before next pitch",
        rationale: "Missing budget and authority",
        due: "Next call",
        status: "Open" as const,
      },
    ],
    outcomeCrm: {
      summary: "Early inbound; discovery incomplete; prior call had compliance flag.",
      goals: ["Evaluate coaching"],
      painPoints: ["Unknown"],
      budget: "Unknown",
      authority: "Influencer only",
      timeline: "Unknown",
      competitors: [],
      objections: [],
      buyingIntent: 41,
      dealRisk: 61,
      probability: 34,
      probabilityWhy: "Incomplete qualification + compliance overhang",
      suggestedEmail: "Rania — three questions to tailor the next conversation…",
      suggestedFollowUp: "Discovery call only — no pitch",
    },
  },
];

export const certifications = [
  {
    id: "cert-product",
    name: "Product certification",
    requiredFor: ["All campaigns"],
    lessons: 4,
    roleplays: 1,
    minScore: 80,
    expiryDays: 365,
    holders: ["e-01", "e-02", "e-03", "e-04"],
  },
  {
    id: "cert-discovery",
    name: "Discovery certification",
    requiredFor: ["Forex desks — EU tier 1", "Predictive dialer"],
    lessons: 3,
    roleplays: 3,
    minScore: 75,
    expiryDays: 180,
    holders: ["e-01", "e-02", "e-04"],
  },
  {
    id: "cert-compliance",
    name: "Compliance certification",
    requiredFor: ["CFD Desk campaigns"],
    lessons: 2,
    roleplays: 1,
    minScore: 90,
    expiryDays: 90,
    holders: ["e-02", "e-04"],
  },
];

export const campaignAccessRules = [
  {
    campaign: "Forex desks — EU tier 1",
    requireCerts: ["Product certification", "Discovery certification"],
    lockedAgents: [{ agentId: "e-05", agent: "Jonas Berg", missing: ["Discovery certification"], progress: 28 }],
  },
  {
    campaign: "CFD outbound",
    requireCerts: ["Product certification", "Compliance certification"],
    lockedAgents: [{ agentId: "e-03", agent: "Daniel Okoye", missing: ["Compliance certification"], progress: 45 }],
  },
];

export const playbookRecommendations = [
  {
    id: "pb-1",
    title: "Ask decision-criteria question before any discount language",
    evidenceCalls: 214,
    conversionLift: 21,
    confidence: 92,
    campaigns: ["Forex desks — EU tier 1"],
    status: "Pending approval" as const,
    source: "Top-Rep DNA · Mira Kovač + closed-won cluster",
  },
  {
    id: "pb-2",
    title: "Require dated next step before call disposition ‘Connected — follow up’",
    evidenceCalls: 480,
    conversionLift: 14,
    confidence: 88,
    campaigns: ["All outbound"],
    status: "Pending approval" as const,
    source: "Lost-deal analysis",
  },
  {
    id: "pb-3",
    title: "Replace ‘guaranteed returns’ phrasing with approved risk disclosure",
    evidenceCalls: 37,
    conversionLift: 0,
    confidence: 99,
    campaigns: ["CFD Desk"],
    status: "Approved" as const,
    source: "Compliance QA",
  },
  {
    id: "pb-4",
    title: "Open enterprise calls with performance-gap question (top vs floor)",
    evidenceCalls: 96,
    conversionLift: 11,
    confidence: 85,
    campaigns: ["Forex desks — EU tier 1"],
    status: "In test" as const,
    source: "Winning openings cluster",
  },
];

export const coachingRevenueStory = {
  title: "Price-objection coaching → booked meetings",
  agent: "Alex Moreau",
  skill: "Objection handling / Price justification",
  before: 41,
  after: 68,
  conversionLift: 12,
  revenueInfluenced: 186_000,
  caveat: "Evidence-based correlation unless causality is statistically supported.",
};

export const ceoRevenueIntel = {
  summary:
    "This week, conversion increased 8%. The strongest contributor was improved price-objection handling in the Forex desks — EU tier 1 campaign. Three representatives remain below certification standards and account for €124,000 of at-risk pipeline.",
  kpis: [
    { label: "Revenue MTD", value: "€1.84M", delta: 8 },
    { label: "Forecast", value: "€2.31M", delta: 3 },
    { label: "Win rate", value: "27%", delta: 2 },
    { label: "Avg deal size", value: "€94k", delta: 5 },
    { label: "Coaching-influenced", value: "€186k", delta: 18 },
    { label: "At-risk pipeline", value: "€124k", delta: -6 },
    { label: "Sales cycle", value: "31d", delta: -4 },
    { label: "Forecast confidence", value: "81%", delta: 2 },
  ],
  topObjections: [
    { name: "Price vs competitor", lost: 18, eur: 420000 },
    { name: "No decision date", lost: 11, eur: 210000 },
    { name: "Security / procurement", lost: 7, eur: 310000 },
  ],
  winningTracks: [
    "Decision-criteria question before discount",
    "ROI anchored to their close-rate spread",
    "Two-team pilot with day-30 review",
  ],
};

export const managerQaWorkspace = {
  copilotAnswers: [
    {
      q: "Who needs coaching today?",
      a: "Jonas Berg (discovery + objections) and Daniel Okoye (urgency + compliance recert).",
    },
    {
      q: "Why did conversion decrease on Reactivation Q3?",
      a: "Follow-up lag on Aegean FX and competitor price pressure; win probability fell 72→54.",
    },
    {
      q: "Which calls should I review first?",
      a: "Levant Markets (compliance language), Aegean FX (risk disclosure), then Feldman Capital (best-practice clip).",
    },
  ],
  heatmap: [
    { rep: "Alex", discovery: 64, objections: 93, close: 84, compliance: 91 },
    { rep: "Sofia", discovery: 88, objections: 81, close: 81, compliance: 96 },
    { rep: "Daniel", discovery: 77, objections: 70, close: 72, compliance: 68 },
    { rep: "Mira", discovery: 90, objections: 96, close: 94, compliance: 94 },
    { rep: "Jonas", discovery: 48, objections: 41, close: 58, compliance: 82 },
  ],
};

export const knowledgeDocuments = [
  { id: "kb-1", title: "Enterprise forex pricing sheet", type: "Pricing", updated: "2d ago", chunks: 24 },
  { id: "kb-2", title: "Gong battlecard v3", type: "Competitive", updated: "5d ago", chunks: 18 },
  { id: "kb-3", title: "Risk disclosure script v4", type: "Compliance", updated: "1d ago", chunks: 9 },
  { id: "kb-4", title: "Meridian Brokers case study", type: "Proof", updated: "1w ago", chunks: 12 },
];

export const topRepDna = {
  sourceRep: "Mira Kovač",
  behaviors: [
    "Asks decision criteria before any commercial concession",
    "Anchors ROI to the prospect’s own performance gap",
    "Always leaves with a dated calendar hold",
  ],
  doNotCopy: ["Personal vocal mannerisms", "Identity-specific stories"],
  transferable: ["Discovery sequence", "Objection structure", "Timing of price discussion"],
};

// INTEGRATION: Wire to STT/LLM edge functions — surfaces are complete; not production AI.
export const AI_INTEGRATION_NOTICE =
  "Demo intelligence layer — connect speech-to-text, model runs, and CRM webhooks for production.";
