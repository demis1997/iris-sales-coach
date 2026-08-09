export const DEMO_COMPANY = {
  id: "apex-markets",
  name: "Apex Markets",
  legalName: "Apex Markets Ltd",
  industry: "Forex / CFD Brokerage",
  location: "Limassol, Cyprus",
  agents: 48,
  managers: 4,
  teams: 4,
  periodLabel: "Today · Demo period",
  ceo: { id: "ceo-alex", name: "Alex Morgan", title: "CEO" },
  defaultManagerId: "mgr-sarah",
  defaultAgentId: "agt-maria",
  storyAgentId: "agt-daniel",
  storyCallId: "call-daniel-lost",
  mariaCallId: "call-maria-followup",
  liveCallId: "call-maria-live",
} as const;

export const DEMO_KPIS = {
  totalDeposits: 428_500,
  totalDepositsDelta: 12.4,
  ftds: 186,
  ftdsDelta: 18.2,
  conversionRate: 14.8,
  conversionDeltaPts: 2.1,
  activeAgents: 43,
  totalAgents: 48,
  callsToday: 3842,
  revenueAtRisk: 71_400,
  revenueAtRiskTooltip:
    "Estimated opportunity value associated with high-intent prospects requiring follow-up. Not guaranteed lost revenue.",
};

export const DEMO_FUNNEL = [
  { stage: "Leads", value: 14280 },
  { stage: "Reached", value: 8940 },
  { stage: "Qualified", value: 3140 },
  { stage: "High Intent", value: 1580 },
  { stage: "FTD", value: 186 },
];

export const DEMO_LOSS_REASONS = [
  { id: "trust", label: "Trust / credibility", pct: 24, calls: 342, value: 92000 },
  { id: "price", label: "Price / fees", pct: 19, calls: 271, value: 71000 },
  { id: "later", label: "Call me later", pct: 17, calls: 242, value: 54000 },
  { id: "info", label: "Needs more information", pct: 14, calls: 199, value: 41000 },
  { id: "withdrawal", label: "Withdrawal concerns", pct: 11, calls: 157, value: 48000 },
  { id: "competitor", label: "Competitor", pct: 8, calls: 114, value: 29000 },
  { id: "other", label: "Other", pct: 7, calls: 100, value: 18000 },
];

export const EXECUTIVE_BRIEF = {
  body: `Conversion increased 12% this week, driven primarily by Alpha Desk and Prime Desk.

The strongest improvement came from agents who completed objection-handling coaching last week.

The most common reason high-intent prospects failed to deposit today was hesitation around withdrawal procedures and platform trust.

7 high-value opportunities worth approximately €38K require manager attention.

Velocity Desk is generating strong call volume but converting 23% below the company average.`,
};

export const COACHING_ROI = {
  before: 11.2,
  after: 14.7,
  deltaPts: 3.5,
  label: "Demo cohort comparison — not scientifically causal",
};
