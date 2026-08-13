import type { CoachingAssignment, LiveFloorAgent, LiveSuggestion } from "@/lib/demo/types";

export const DEMO_COACHING: CoachingAssignment[] = [
  {
    id: "coach-sofia",
    agentId: "agt-sofia",
    agentName: "Sofia Petrova",
    weakness: "Price objection handling",
    evidence: "Detected 7 times this week · −18% conversion probability",
    recommendation:
      'Assign "Value Before Price" roleplay. Sofia discounts too early when prospects mention fees.',
    assignment: "Value Before Price roleplay",
    due: "Today",
    status: "open",
  },
  {
    id: "coach-michael",
    agentId: "agt-leo",
    agentName: "Michael Reed",
    weakness: "Talking too much during discovery",
    evidence: "Talk/listen 71/29 vs team average 54/46",
    recommendation: "Discovery questioning coaching session — force a 2:1 question-to-statement ratio.",
    assignment: "Discovery depth coaching",
    due: "Tomorrow",
    status: "open",
  },
  {
    id: "coach-daniel",
    agentId: "agt-daniel",
    agentName: "Daniel Costa",
    weakness: "Closing",
    evidence: "5 calls this week with buying signals and no ask",
    recommendation:
      "Daniel identifies buying signals correctly but continues explaining the product instead of asking for commitment.",
    assignment: "Closing high-intent prospects",
    due: "Tomorrow",
    status: "open",
  },
  {
    id: "coach-maria",
    agentId: "agt-maria",
    agentName: "Maria Georgiou",
    weakness: "Closing polish",
    evidence: "Objection handling improved +11%",
    recommendation: "Recommended for advanced closing training after strong trust recovery patterns.",
    assignment: "Advanced closing for high-intent",
    due: "Friday",
    status: "open",
  },
];

export const LIVE_FLOOR: LiveFloorAgent[] = [
  {
    agentId: "agt-maria",
    name: "Maria Georgiou",
    status: "live",
    duration: "04:12",
    signal: "high_intent",
    callId: "call-maria-live",
  },
  {
    agentId: "agt-sofia",
    name: "Sofia Petrova",
    status: "live",
    duration: "02:41",
    signal: "objection",
    callId: "call-e2",
  },
  {
    agentId: "agt-daniel",
    name: "Daniel Costa",
    status: "wrap",
    signal: null,
  },
  {
    agentId: "agt-anna",
    name: "Anna Morgan",
    status: "available",
    signal: null,
  },
  {
    agentId: "agt-leo",
    name: "Michael Reed",
    status: "live",
    duration: "06:08",
    signal: "ai_assisting",
    callId: "call-daniel-lost",
  },
  { agentId: "agt-george", name: "George Papadopoulos", status: "available", signal: null },
  { agentId: "agt-chris", name: "Chris Nicolaou", status: "break", signal: "compliance" },
];

export const LIVE_SUGGESTIONS: LiveSuggestion[] = [
  {
    id: "ls1",
    atMs: 1600,
    kind: "objection",
    label: "OBJECTION · Withdrawal concern",
    suggestion: "Address trust before continuing the pitch.",
    script:
      "That's completely understandable. Let me explain exactly how the withdrawal process works before we discuss anything else.",
  },
  {
    id: "ls2",
    atMs: 4200,
    kind: "trust",
    label: "Trust risk ↑",
    suggestion: "Explain withdrawal policy. Avoid pushing for deposit yet.",
    script:
      "Here's our policy in plain terms — same-day processing for verified accounts. I'll send the steps in writing right after this call.",
  },
];

export const MANAGER_ATTENTION = [
  {
    id: "att-1",
    agentId: "agt-daniel",
    agentName: "Daniel Petrou",
    title: "Closing performance dropped 14%",
    detail: "3 high-intent calls lost today",
    tone: "warn" as const,
    action: "Review calls",
    hrefCallId: "call-daniel-lost",
    hrefAgentId: null as string | null,
  },
  {
    id: "att-2",
    agentId: "agt-maria",
    agentName: "Maria Georgiou",
    title: "Objection handling improved +11%",
    detail: "Recommended for advanced closing training",
    tone: "good" as const,
    action: "View progress",
    hrefCallId: null as string | null,
    hrefAgentId: "agt-maria",
  },
  {
    id: "att-3",
    agentId: "agt-chris",
    agentName: "Chris Nicolaou",
    title: "Critical compliance phrase missed",
    detail: "1 call requires review",
    tone: "bad" as const,
    action: "Review now",
    hrefCallId: "call-e3",
    hrefAgentId: null as string | null,
  },
];

export const WINNING_PATTERNS = [
  "Top performers ask 2.4× more discovery questions before presenting the offer.",
  "Top performers address withdrawal concerns earlier in the conversation.",
  "Top performers confirm a concrete next step 78% of the time.",
];

export const ASK_RELAY_ANSWERS: Record<string, string> = {
  "Why did I lose my last call?":
    "Demo analysis: On Client 10821 you built trust well, but at 10:55 the prospect softened and you scheduled a follow-up instead of a soft close into KYC. Closing when intent peaks is your #1 lift this week.",
  "How should I handle withdrawal objections?":
    "Demo playbook: Acknowledge → explain same-day verified withdrawals → send policy in writing → only then discuss funding. Never pitch features while trust is unresolved.",
  "What am I doing differently from top performers?":
    "Your discovery (91) beats desk average. Leo and Anna close 2.4× more often after a buying signal within 10 seconds. Practice that ask in roleplay today.",
  "What should I focus on today?":
    "Improve closing on high-intent prospects. Target: Closing 76 → 80. Complete one withdrawal-objection roleplay before lunch.",
};
