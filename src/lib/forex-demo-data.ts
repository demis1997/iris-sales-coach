/** Simulated forex-broker workspace data for the public /demo experience. */

export type DemoRole = "ceo" | "manager" | "agent";

export const DEMO_BROKER = {
  name: "Meridian FX",
  desk: "EU Retail Acquisition",
  regulation: "CySEC · FCA mirror",
  period: "This week",
};

export const ceoKpis = [
  { label: "First-time deposits", value: "184", delta: 12, hint: "vs last week" },
  { label: "Deposit volume", value: "$2.41M", delta: 9, hint: "funded accounts" },
  { label: "Call → FTD rate", value: "18.4%", delta: 3, hint: "qualified dials" },
  { label: "Avg AI quality", value: "81", delta: 5, hint: "score / 100" },
  { label: "Compliance flags", value: "7", delta: -22, hint: "guaranteed-return language" },
  { label: "Retention risk", value: "11", delta: -8, hint: "accounts need callback" },
];

export const deskComparison = [
  { desk: "EU Retail", ftd: 74, quality: 84, compliance: 96, agents: 14 },
  { desk: "MENA VIP", ftd: 41, quality: 79, compliance: 91, agents: 9 },
  { desk: "LatAm CFD", ftd: 38, quality: 72, compliance: 88, agents: 11 },
  { desk: "APAC Night", ftd: 31, quality: 77, compliance: 94, agents: 8 },
];

export const revenueByDay = [
  { day: "Mon", deposits: 310, ftds: 28 },
  { day: "Tue", deposits: 420, ftds: 34 },
  { day: "Wed", deposits: 380, ftds: 31 },
  { day: "Thu", deposits: 510, ftds: 42 },
  { day: "Fri", deposits: 470, ftds: 39 },
  { day: "Sat", deposits: 180, ftds: 10 },
  { day: "Sun", deposits: 140, ftds: 0 },
];

export const managerQueue = [
  {
    id: "q1",
    agent: "Nikos P.",
    prospect: "Ahmed R. · Dubai",
    issue: "Promised 'risk-free' bonus language",
    severity: "critical" as const,
    score: 58,
    ago: "12 min",
  },
  {
    id: "q2",
    agent: "Elena V.",
    prospect: "Marco S. · Milan",
    issue: "Skipped risk disclosure before deposit ask",
    severity: "high" as const,
    score: 64,
    ago: "28 min",
  },
  {
    id: "q3",
    agent: "James K.",
    prospect: "Priya N. · London",
    issue: "Strong discovery · coaching on close timing",
    severity: "low" as const,
    score: 88,
    ago: "41 min",
  },
  {
    id: "q4",
    agent: "Sofia L.",
    prospect: "Carlos M. · São Paulo",
    issue: "Spread objection — used discount instead of execution",
    severity: "medium" as const,
    score: 71,
    ago: "1h",
  },
];

export const coachingTasks = [
  { agent: "Nikos P.", task: "Re-certify promotions compliance (guaranteed returns)", due: "Today" },
  { agent: "Elena V.", task: "Practice risk disclosure openers · 5 roleplays", due: "Tomorrow" },
  { agent: "LatAm desk", task: "Reframe spread objections to fill / slippage", due: "Fri" },
];

export const agentCalls = [
  {
    id: "a1",
    time: "09:14",
    prospect: "Viktor H. · Cyprus",
    product: "EURUSD · Standard account",
    outcome: "FTD $5,000",
    score: 91,
    tip: "Asked lot size before quoting spread — textbook.",
  },
  {
    id: "a2",
    time: "10:02",
    prospect: "Layla M. · UAE",
    product: "Gold · VIP upgrade",
    outcome: "Callback Tue",
    score: 76,
    tip: "Talk ratio 71% — let her finish leverage concerns.",
  },
  {
    id: "a3",
    time: "11:28",
    prospect: "Tom W. · UK",
    product: "CFD stocks",
    outcome: "KYC pending",
    score: 84,
    tip: "Clear appropriateness check before deposit link.",
  },
  {
    id: "a4",
    time: "14:05",
    prospect: "Ana C. · Spain",
    product: "MT5 · Pro",
    outcome: "Lost · competitor",
    score: 62,
    tip: "Price-anchored before execution story — reverse next time.",
  },
];

export const agentDna = [
  { skill: "Discovery", score: 82 },
  { skill: "Objection handling", score: 74 },
  { skill: "Compliance", score: 91 },
  { skill: "Closing", score: 69 },
  { skill: "Product knowledge", score: 88 },
  { skill: "Confidence", score: 77 },
];

/** Rotating AI tips — forex acquisition / retention / compliance. */
export const forexAiTips = [
  {
    role: "ceo" as const,
    title: "Shift EU Retail dials to 10–11 AM local",
    body: "FTD conversion is 2.1× higher in that window versus afternoon. Move 20% of LatAm overflow capacity into the EU morning block.",
    impact: "+$94K projected weekly deposits",
  },
  {
    role: "ceo" as const,
    title: "MENA VIP quality dipping on leverage framing",
    body: "Three agents are selling max leverage before suitability checks. Compliance risk is rising faster than FTD volume on that desk.",
    impact: "7 flagged calls in 48h",
  },
  {
    role: "ceo" as const,
    title: "Retention: 11 funded accounts silent 9+ days",
    body: "Accounts that fund then go dark for 9 days churn at 61%. Queue a manager-assisted re-engagement with education, not a deposit push.",
    impact: "Protect ~$180K AUM at risk",
  },
  {
    role: "ceo" as const,
    title: "APAC night desk under-indexes on gold leads",
    body: "Gold inquiry calls convert at 24% FTD when agents open with volatility + hedging use-case. Current script opens on EURUSD.",
    impact: "+6 FTD / week if script swaps",
  },
  {
    role: "manager" as const,
    title: "Stop discounting the spread",
    body: "On competitive price objections, agents who reframe to fill quality and slippage win 2.4× more often than those who offer a temporary spread cut.",
    impact: "Apply on next 10 review calls",
  },
  {
    role: "manager" as const,
    title: "Nikos needs compliance gate before dialer unlock",
    body: "Two 'risk-free profit' phrases in one shift. Lock CFD outbound until he passes the promotions micro-cert (8 minutes).",
    impact: "Prevent regulatory exposure",
  },
  {
    role: "manager" as const,
    title: "Elena's discovery is strong — close earlier",
    body: "She covers 7/8 qualifiers but waits too long for the deposit ask. Average funded call on her book is 19 min; top closers ask at minute 11–13.",
    impact: "+3 FTD / week potential",
  },
  {
    role: "manager" as const,
    title: "Roleplay: news-event requote objection",
    body: "Friday's lost deals clustered around 'I got requoted at NFP'. Run a 15-minute huddle with the execution vs spread card.",
    impact: "Desk-wide objection drill",
  },
  {
    role: "agent" as const,
    title: "Ask volume before you quote the spread",
    body: "\"How many lots do you trade in a typical week?\" then compare all-in cost. Quoting pips first loses the execution story.",
    impact: "Your next 5 outbound calls",
  },
  {
    role: "agent" as const,
    title: "Acknowledge leverage fear, then educate",
    body: "When they say 'leverage scares me', don't jump to 1:30. Map their risk comfort, then show margin calculator on a small size.",
    impact: "Higher KYC completion",
  },
  {
    role: "agent" as const,
    title: "Risk disclosure before the deposit link",
    body: "Compliance score drops hard when the funding URL is sent before the risk summary. Say the disclosure, pause, then send.",
    impact: "Keep score above 85",
  },
  {
    role: "agent" as const,
    title: "Competitor lock-in? Ask for 10% of flow",
    body: "\"Keep your primary — what would a second route need to earn 10% of your EURUSD?\" Works better than 'switch everything'.",
    impact: "Wins against incumbents",
  },
  {
    role: "agent" as const,
    title: "Talk less on VIP gold calls",
    body: "Your last three VIP calls were 68–74% talk ratio. Target under 55%. Ask what they disliked about their last broker's gold fills.",
    impact: "+confidence & trust",
  },
  {
    role: "agent" as const,
    title: "Close with a calendar, not 'I'll follow up'",
    body: "Book Tuesday 10:00 for KYC review while you're on the line. Vague follow-ups drop 40% in your book.",
    impact: "More show-ups",
  },
];

export function pickRandomTip(role: DemoRole, excludeTitle?: string) {
  const pool = forexAiTips.filter((t) => t.role === role && t.title !== excludeTitle);
  return pool[Math.floor(Math.random() * pool.length)] ?? forexAiTips[0];
}

export const liveCoachLines = [
  { at: "02:14", who: "prospect" as const, text: "Your spreads look wider than IC Markets on EURUSD." },
  { at: "02:18", who: "ai" as const, text: "Tip: Don't defend the pip. Ask monthly lot volume, then compare all-in cost + fill quality." },
  { at: "02:31", who: "agent" as const, text: "Fair — how many lots do you usually trade a week on majors?" },
  { at: "02:40", who: "prospect" as const, text: "Around forty to fifty. I care more about requotes at news." },
  { at: "02:44", who: "ai" as const, text: "Strong signal. Pivot to execution / slippage. Deposit ask after risk disclosure." },
];
