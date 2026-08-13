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
  id: "contact-james",
  label: "James Wilson",
  status: "Reactivation",
  intent: "Medium",
  leadSource: "Existing customer",
  country: "United Kingdom",
  assigned: "Maria Georgiou",
  registered: "Reactivation · 8 days ago",
  previousCalls: 3,
  lastOutcome: "Ended on withdrawal concerns",
  phoneMasked: "+44 ••• ••• 0182",
  campaign: "UK Reactivation",
  concerns: ["Trust", "Withdrawals"],
  interests: ["Forex", "Account funding"],
  timeline: [
    { id: "t1", at: "−8d", label: "Previous deposit €2,500" },
    { id: "t2", at: "−8d", label: "Call ended · withdrawal concern" },
    { id: "t3", at: "−3d", label: "SMS follow-up sent" },
    { id: "t4", at: "Today", label: "Assigned to Maria" },
    { id: "t5", at: "NOW", label: "Live call", current: true },
  ],
};

export const QUEUE_LEADS: QueueLead[] = [
  {
    id: "contact-james",
    label: "James Wilson",
    country: "United Kingdom",
    leadSource: "Reactivation",
    priority: "high",
    registeredAgo: "Last contact 8 days ago",
  },
  {
    id: "contact-anna",
    label: "Anna Becker",
    country: "Germany",
    leadSource: "Acquisition",
    priority: "high",
    registeredAgo: "New lead",
  },
  {
    id: "contact-lucas",
    label: "Lucas Martin",
    country: "France",
    leadSource: "VIP Retention",
    priority: "medium",
    registeredAgo: "2 days ago",
  },
];

export const PROCESSING_STEPS: ProcessingStep[] = [
  { id: "transcript", label: "Transcript complete", done: false },
  { id: "analyzed", label: "Conversation analyzed", done: false },
  { id: "crm", label: "CRM updated", done: false },
  { id: "coaching", label: "Coaching generated", done: false },
];

export const POST_CALL_REVIEW: PostCallReview = {
  outcome: "Follow-up Required",
  intent: "Medium",
  aiScore: 84,
  conversionProbability: 68,
  primaryObjection: "Trust / Withdrawal",
  nextBestAction: "Follow up tomorrow at 14:30",
  didWell: [
    "Strong discovery questions",
    "Allowed customer to explain previous concerns",
    "Maintained confident tone",
  ],
  missedAt: "04:12",
  missedClient: "I'm interested but last time withdrawals took longer than I expected.",
  missedAgent: "Understood — and our deposit options start from…",
  missedInsight:
    "You introduced the deposit amount approximately 40 seconds earlier than ideal. Verify the withdrawal concern is fully resolved before pitching.",
  tryInsteadOf: "Understood — and our deposit options start from…",
  tryInstead:
    "Which part of the previous withdrawal experience caused the most frustration? Let me clarify that first.",
  followUpTitle: "Follow up tomorrow at 14:30",
  followUpReason:
    "Lead with the withdrawal process clarification before discussing account funding.",
  suggestedWhatsApp:
    "Hi James — good speaking earlier. I'm sending the withdrawal steps we discussed so you can review them. Happy to walk through funding once that feels clear.",
};

/** Mid-call entry — story already in objection handling (~07:48). */
export const MID_CALL_START_MS = 7 * 60 * 1000 + 48 * 1000;

export function createInitialSession(mode: "midcall" | "idle" = "idle"): CallSession {
  return {
    id: LIVE_CALL_ID,
    companyName: "Apex Markets",
    campaign: "UK Reactivation",
    agent: {
      id: "agt-maria",
      role: "agent",
      name: "Maria Georgiou",
      label: "Agent",
    },
    prospect: {
      id: "contact-james",
      role: "prospect",
      name: "James Wilson",
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
