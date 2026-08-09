import type {
  CallSession,
  CallStage,
  LeadContext,
  LiveSignal,
  PlaybookChecklistItem,
  PostCallReview,
  ProcessingStep,
  QueueLead,
} from "./types";

export const LIVE_CALL_ID = "call-maria-live-workspace";
export const MANAGER_LIVE_CALL_ID = "call-maria-live";

export const PLAYBOOK_WITHDRAWAL = {
  id: "pb-withdrawal",
  title: "Handling withdrawal concerns",
  body: `Apex Markets · Demo playbook

1. Acknowledge the concern without defensiveness.
2. Explain the verified withdrawal path in plain language (KYC → request → processing window).
3. Offer to send the steps in writing before any funding discussion.
4. Confirm the prospect understands, then ask what they wanted to achieve by registering.
5. Only move to account readiness after trust is restored.

Never pitch spreads, bonuses, or “another feature” while withdrawal trust is unresolved.`,
};

export const DEFAULT_STAGES: CallStage[] = [
  { id: "opening", label: "Opening", state: "complete" },
  { id: "discovery", label: "Discovery", state: "complete" },
  { id: "qualification", label: "Qualification", state: "complete" },
  { id: "objection", label: "Objection Handling", state: "active" },
  { id: "closing", label: "Closing", state: "upcoming" },
  { id: "followup", label: "Follow-up", state: "upcoming" },
];

export const DEFAULT_SIGNALS: LiveSignal[] = [
  { key: "buying_intent", label: "Buying Intent", value: "High", trend: "flat" },
  { key: "trust", label: "Trust", value: "Medium", trend: "down" },
  { key: "objection", label: "Objection", value: "Withdrawal", trend: "flat" },
  { key: "call_stage", label: "Call Stage", value: "Objection Handling", trend: "flat" },
];

export const DEFAULT_CHECKLIST: PlaybookChecklistItem[] = [
  { id: "ack", label: "Acknowledge concern", done: true },
  { id: "explain", label: "Explain withdrawal process", done: false },
  { id: "confirm", label: "Confirm understanding", done: false },
  { id: "objective", label: "Return to customer's objective", done: false },
];

export const LEAD_10821: LeadContext = {
  id: "contact-10821",
  label: "Client 10821",
  status: "Qualified",
  intent: "High",
  leadSource: "Web Registration",
  country: "Germany",
  assigned: "Maria Georgiou",
  registered: "Today, 09:14",
  previousCalls: 1,
  lastOutcome: "Callback requested",
  phoneMasked: "+49 ••• ••• 4821",
  campaign: "EU New Registrations",
  concerns: ["Trust", "Withdrawals"],
  interests: ["Forex", "EUR/USD", "Beginner account"],
  timeline: [
    { id: "t1", at: "09:14", label: "Registered" },
    { id: "t2", at: "09:17", label: "Assigned to Maria" },
    { id: "t3", at: "09:34", label: "First call · No answer" },
    { id: "t4", at: "11:06", label: "Callback" },
    { id: "t5", at: "NOW", label: "Live call", current: true },
  ],
};

export const QUEUE_LEADS: QueueLead[] = [
  {
    id: "contact-10914",
    label: "Client 10914",
    country: "France",
    leadSource: "Web Registration",
    priority: "high",
    registeredAgo: "4 minutes ago",
  },
  {
    id: "contact-10922",
    label: "Client 10922",
    country: "Netherlands",
    leadSource: "Partner referral",
    priority: "medium",
    registeredAgo: "18 minutes ago",
  },
  {
    id: "contact-10931",
    label: "Client 10931",
    country: "Spain",
    leadSource: "Web Registration",
    priority: "medium",
    registeredAgo: "31 minutes ago",
  },
];

export const PROCESSING_STEPS: ProcessingStep[] = [
  { id: "transcript", label: "Transcript complete", done: false },
  { id: "analyzed", label: "Conversation analyzed", done: false },
  { id: "crm", label: "CRM updated", done: false },
  { id: "coaching", label: "Coaching generated", done: false },
];

export const POST_CALL_REVIEW: PostCallReview = {
  outcome: "Follow-up required",
  intent: "High",
  aiScore: 82,
  conversionProbability: 72,
  primaryObjection: "Withdrawal Trust",
  nextBestAction: "Follow up today",
  didWell: [
    "Strong discovery",
    "Asked about previous experience",
    "Acknowledged customer concern",
    "Clear product explanation",
  ],
  missedAt: "08:14",
  missedClient: "Okay, that actually makes sense.",
  missedAgent: "Great, and another feature we offer…",
  missedInsight:
    "The prospect had moved from objection to acceptance. This was an opportunity to ask for commitment.",
  tryInsteadOf: "Great, and another feature we offer…",
  tryInstead: "Great. Would you like me to walk you through getting the account ready now?",
  followUpTitle: "Follow up today before 17:00",
  followUpReason: "High intent remains, but withdrawal trust needs reinforcement.",
  suggestedWhatsApp:
    "Hi — good speaking earlier. I'm sending over the withdrawal information we discussed so you can review it. Let me know if you'd like me to walk you through the next step.",
};

/** Mid-call entry — story already in objection handling (~07:48). */
export const MID_CALL_START_MS = 7 * 60 * 1000 + 48 * 1000;

export function createInitialSession(mode: "midcall" | "idle" = "idle"): CallSession {
  return {
    id: LIVE_CALL_ID,
    companyName: "Apex Markets",
    campaign: "EU New Registrations",
    agent: {
      id: "agt-maria",
      role: "agent",
      name: "Maria Georgiou",
      label: "Agent",
    },
    prospect: {
      id: "contact-10821",
      role: "prospect",
      name: "Client 10821",
      label: "Prospect",
    },
    lead: LEAD_10821,
    status: mode === "midcall" ? "CONNECTED" : "AVAILABLE",
    phase: "softphone",
    direction: "outbound",
    connectionQuality: "good",
    muted: false,
    onHold: false,
    elapsedMs: mode === "midcall" ? MID_CALL_START_MS : 0,
    stages: DEFAULT_STAGES.map((s) => ({ ...s })),
    transcript: [],
    activeSpeaker: null,
    signals: DEFAULT_SIGNALS.map((s) => ({ ...s })),
    suggestions: [],
    playbookStage: "Objection Handling",
    playbookChecklist: DEFAULT_CHECKLIST.map((c) => ({ ...c })),
    notes: "",
    speed: 1,
    processingSteps: PROCESSING_STEPS.map((s) => ({ ...s })),
    review: null,
    reviewProvider: null,
    disposition: null,
    followUpDate: "",
    followUpTime: "",
    followUpNotes: "",
    keypadOpen: false,
    playbookDrawerOpen: false,
    managerCanMonitor: true,
    managerName: "Sarah Mitchell",
    callsToday: 18,
    ftdsToday: 3,
    conversionToday: 16.7,
  };
}
