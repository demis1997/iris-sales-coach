// Realistic demo data powering the Iris dashboards.

export type Call = {
  id: string;
  date: string;
  time: string;
  prospect: string;
  company: string;
  duration: string;
  outcome: "Closed" | "Follow-up" | "Lost" | "No answer" | "Qualified";
  score: number;
  confidence: number;
  status: "Analyzed" | "Processing";
  talkRatio: number;
  interruptions: number;
  fillerWords: number;
  deadAir: string;
};

export const calls: Call[] = [
  { id: "c-1841", date: "Jul 30", time: "09:12", prospect: "Marcus Feldman", company: "Feldman Capital", duration: "14:22", outcome: "Closed", score: 92, confidence: 88, status: "Analyzed", talkRatio: 54, interruptions: 1, fillerWords: 7, deadAir: "0:11" },
  { id: "c-1840", date: "Jul 30", time: "10:04", prospect: "Yara Haddad", company: "Meridian FX", duration: "08:47", outcome: "Follow-up", score: 78, confidence: 71, status: "Analyzed", talkRatio: 72, interruptions: 4, fillerWords: 19, deadAir: "0:34" },
  { id: "c-1839", date: "Jul 30", time: "10:52", prospect: "Daniel Okoye", company: "Northgate Realty", duration: "21:03", outcome: "Qualified", score: 85, confidence: 82, status: "Analyzed", talkRatio: 61, interruptions: 2, fillerWords: 11, deadAir: "0:19" },
  { id: "c-1838", date: "Jul 29", time: "16:31", prospect: "Sofia Lindqvist", company: "Aurora Insurance", duration: "06:15", outcome: "Lost", score: 61, confidence: 54, status: "Analyzed", talkRatio: 82, interruptions: 6, fillerWords: 27, deadAir: "1:02" },
  { id: "c-1837", date: "Jul 29", time: "14:08", prospect: "Peter Almeida", company: "Vault Trading", duration: "11:44", outcome: "Closed", score: 89, confidence: 86, status: "Analyzed", talkRatio: 49, interruptions: 0, fillerWords: 5, deadAir: "0:08" },
  { id: "c-1836", date: "Jul 29", time: "11:22", prospect: "Hana Ito", company: "Kestrel Recruitment", duration: "03:02", outcome: "No answer", score: 0, confidence: 0, status: "Processing", talkRatio: 0, interruptions: 0, fillerWords: 0, deadAir: "—" },
  { id: "c-1835", date: "Jul 28", time: "15:47", prospect: "Ali Rahman", company: "Crescent Brokers", duration: "17:56", outcome: "Follow-up", score: 74, confidence: 68, status: "Analyzed", talkRatio: 69, interruptions: 3, fillerWords: 16, deadAir: "0:41" },
  { id: "c-1834", date: "Jul 28", time: "09:58", prospect: "Grace Whitfield", company: "Harbor Wealth", duration: "12:38", outcome: "Closed", score: 94, confidence: 91, status: "Analyzed", talkRatio: 52, interruptions: 1, fillerWords: 4, deadAir: "0:06" },
];

export const callStages = [
  { stage: "Greeting", score: 96, feedback: "Warm, confident opening with a clear reason for the call.", suggestion: "Add a one-line permission ask to lower resistance." },
  { stage: "Discovery", score: 74, feedback: "Only 3 discovery questions asked before moving forward.", suggestion: "Aim for 6–8 open questions and confirm budget authority." },
  { stage: "Pitch", score: 88, feedback: "Strong framing around risk management, tied to their volume.", suggestion: "Delay pricing until the pain is quantified." },
  { stage: "Objections", score: 69, feedback: "Hesitation detected on the spread objection (2.4s pause).", suggestion: "Use the acknowledge → reframe → evidence pattern." },
  { stage: "Closing", score: 91, feedback: "Clear next step booked with a specific date and owner.", suggestion: "Restate the agreed value before the ask." },
  { stage: "Follow-up", score: 84, feedback: "Recap email promised within the hour.", suggestion: "Send a written summary of the objection resolution." },
];

export const objections = [
  {
    objection: "Your spreads are higher than what we get today.",
    response: "We're pretty competitive actually, most clients don't mind.",
    better: "What are you paying now on average per lot? If we're within 0.2 pips but you get execution 40ms faster, does the maths still work against us?",
  },
  {
    objection: "We already have a provider we're happy with.",
    response: "Okay, but maybe we can be a backup.",
    better: "Makes sense — most teams we work with keep their primary. What would a second liquidity route have to do to earn 10% of your flow?",
  },
  {
    objection: "I need to speak to my partner first.",
    response: "Sure, call me when you've spoken to them.",
    better: "Of course. What's the one thing they'll push back on? Let's prepare that answer now so you're not doing my job for me.",
  },
];

export const missingInfo = [
  { item: "Pricing tiers", covered: true },
  { item: "Regulatory disclosure", covered: false },
  { item: "Qualifying questions", covered: false },
  { item: "Clear call-to-action", covered: true },
  { item: "Onboarding timeline", covered: true },
  { item: "Decision maker confirmed", covered: false },
];

export const personality = [
  { trait: "Confidence", value: 88 },
  { trait: "Empathy", value: 76 },
  { trait: "Persuasiveness", value: 82 },
  { trait: "Listening", value: 58 },
  { trait: "Authority", value: 84 },
  { trait: "Patience", value: 63 },
  { trait: "Energy", value: 90 },
  { trait: "Adaptability", value: 71 },
  { trait: "Objections", value: 66 },
  { trait: "Closing", value: 87 },
];

export const improvement = [
  { week: "W18", confidence: 61, score: 66, closeRate: 14, talkRatio: 79 },
  { week: "W19", confidence: 64, score: 69, closeRate: 16, talkRatio: 76 },
  { week: "W20", confidence: 68, score: 72, closeRate: 18, talkRatio: 73 },
  { week: "W21", confidence: 71, score: 74, closeRate: 19, talkRatio: 70 },
  { week: "W22", confidence: 76, score: 79, closeRate: 22, talkRatio: 66 },
  { week: "W23", confidence: 79, score: 82, closeRate: 24, talkRatio: 63 },
  { week: "W24", confidence: 83, score: 86, closeRate: 27, talkRatio: 59 },
  { week: "W25", confidence: 88, score: 90, closeRate: 31, talkRatio: 55 },
];

export const goals = [
  { title: "Increase confidence to 90%", current: 88, target: 90, unit: "%" },
  { title: "Reduce interruptions per call", current: 1.4, target: 1, unit: "" },
  { title: "Improve objection handling", current: 69, target: 85, unit: "pts" },
  { title: "Complete 50 calls this month", current: 38, target: 50, unit: "" },
  { title: "Increase closing rate by 15%", current: 11, target: 15, unit: "%" },
];

export const employees = [
  { id: "e-01", name: "Alex Moreau", dept: "Forex Desk", calls: 214, closeRate: 34, confidence: 88, score: 91, revenue: 412000, trend: 8, risk: "Low" },
  { id: "e-02", name: "Priya Nair", dept: "Forex Desk", calls: 198, closeRate: 31, confidence: 84, score: 88, revenue: 366500, trend: 12, risk: "Low" },
  { id: "e-03", name: "Tom Beckett", dept: "Real Estate", calls: 172, closeRate: 22, confidence: 71, score: 76, revenue: 214300, trend: -4, risk: "Medium" },
  { id: "e-04", name: "Lena Fischer", dept: "Insurance", calls: 241, closeRate: 28, confidence: 79, score: 83, revenue: 288900, trend: 5, risk: "Low" },
  { id: "e-05", name: "Omar Haddad", dept: "Forex Desk", calls: 96, closeRate: 14, confidence: 58, score: 62, revenue: 78400, trend: -11, risk: "High" },
  { id: "e-06", name: "Sara Kim", dept: "Recruitment", calls: 187, closeRate: 26, confidence: 81, score: 84, revenue: 197600, trend: 9, risk: "Low" },
  { id: "e-07", name: "Diego Ramos", dept: "Real Estate", calls: 133, closeRate: 19, confidence: 66, score: 71, revenue: 141200, trend: -2, risk: "Medium" },
  { id: "e-08", name: "Nadia Petrova", dept: "Insurance", calls: 205, closeRate: 30, confidence: 86, score: 89, revenue: 331000, trend: 14, risk: "Low" },
];

export const callsPerDay = [
  { day: "Mon", calls: 412, closed: 96 },
  { day: "Tue", calls: 468, closed: 118 },
  { day: "Wed", calls: 501, closed: 131 },
  { day: "Thu", calls: 487, closed: 122 },
  { day: "Fri", calls: 394, closed: 88 },
  { day: "Sat", calls: 142, closed: 24 },
  { day: "Sun", calls: 61, closed: 9 },
];

export const revenueTrend = [
  { month: "Feb", revenue: 840, score: 71 },
  { month: "Mar", revenue: 962, score: 73 },
  { month: "Apr", revenue: 1104, score: 76 },
  { month: "May", revenue: 1287, score: 79 },
  { month: "Jun", revenue: 1418, score: 82 },
  { month: "Jul", revenue: 1673, score: 86 },
];

export const hourlyCloseRate = [
  { hour: "08", rate: 12 },
  { hour: "09", rate: 19 },
  { hour: "10", rate: 34 },
  { hour: "11", rate: 31 },
  { hour: "12", rate: 17 },
  { hour: "13", rate: 14 },
  { hour: "14", rate: 22 },
  { hour: "15", rate: 27 },
  { hour: "16", rate: 25 },
  { hour: "17", rate: 18 },
];

export const executiveInsights = [
  "Your team improved 8% this week — driven mostly by the Forex desk.",
  "Three employees consistently fail to ask qualification questions.",
  "Calls between 10–11 AM have the highest close rate (34%).",
  "Average confidence increased by 6% month over month.",
  "Most lost deals happen during pricing discussions (61% of losses).",
];

export const alerts = [
  { type: "risk" as const, title: "Omar Haddad — confidence dropped 11%", detail: "12 consecutive calls below a 65 score. Coaching session recommended." },
  { type: "compliance" as const, title: "2 compliance disclosures missed", detail: "Real Estate desk skipped the risk disclosure on 2 calls yesterday." },
  { type: "idle" as const, title: "Diego Ramos — 6h without a call", detail: "Longest idle window this quarter during peak hours." },
  { type: "praise" as const, title: "Nadia Petrova on a 9-day streak", detail: "Highest objection-handling score company-wide this month." },
];

export const teamComparison = [
  { metric: "Confidence", alex: 88, team: 74 },
  { metric: "Closing", alex: 87, team: 69 },
  { metric: "Interruptions", alex: 79, team: 62 },
  { metric: "Pitch timing", alex: 84, team: 71 },
  { metric: "Engagement", alex: 81, team: 70 },
  { metric: "Compliance", alex: 93, team: 82 },
];

export const leaderboard = [
  { rank: 1, name: "Alex Moreau", metric: "34% close rate", score: 91, badge: "Top closer" },
  { rank: 2, name: "Nadia Petrova", metric: "+14% this month", score: 89, badge: "Most improved" },
  { rank: 3, name: "Priya Nair", metric: "84 confidence", score: 88, badge: "Highest confidence" },
  { rank: 4, name: "Sara Kim", metric: "26% close rate", score: 84, badge: "Fastest learner" },
  { rank: 5, name: "Lena Fischer", metric: "241 calls", score: 83, badge: "Longest streak" },
];

export const coachMessages = [
  {
    from: "iris" as const,
    text: "Great job keeping rapport with Marcus — you mirrored his pace and he opened up about the audit deadline within 90 seconds.",
  },
  {
    from: "iris" as const,
    text: "However, you introduced pricing before understanding the customer's needs. Pricing landed at 3:41, before a single budget question.",
  },
  {
    from: "user" as const,
    text: "He asked about price directly though — should I have deflected?",
  },
  {
    from: "iris" as const,
    text: "Deflect once, then trade. Try: \"I'll give you exact numbers in a second — how many lots are you running monthly today?\" That earns the context and keeps control.\n\nOn your next call:\n• Ask more discovery questions\n• Slow down after objections\n• Let the customer speak more\n\nProjected improvement: +17%",
  },
];
