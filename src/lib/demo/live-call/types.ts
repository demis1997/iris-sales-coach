/** Live sales-agent softphone + copilot types.
 * Designed to map later to WebRTC, streaming STT, CRM, and real AI.
 */

export type AgentStatus =
  | "AVAILABLE"
  | "DIALING"
  | "RINGING"
  | "CONNECTED"
  | "ON_HOLD"
  | "WRAP_UP"
  | "OFFLINE";

export type CallStageId =
  | "opening"
  | "discovery"
  | "qualification"
  | "objection"
  | "closing"
  | "followup";

export type CallStageState = "complete" | "active" | "upcoming";

export type CallStage = {
  id: CallStageId;
  label: string;
  state: CallStageState;
};

export type CallDisposition =
  | "ftd"
  | "follow_up"
  | "not_interested"
  | "no_answer"
  | "wrong_number"
  | "needs_info"
  | "compliance";

export type CallParticipantRole = "agent" | "prospect";

export type CallParticipant = {
  id: string;
  role: CallParticipantRole;
  name: string;
  label: string;
};

export type TranscriptSegment = {
  id: string;
  atMs: number;
  atLabel: string;
  speaker: CallParticipantRole;
  name: string;
  text: string;
  /** Partial STT fragment before final text lands */
  partial?: boolean;
  highlight?: "good" | "opportunity" | "risk" | "objection";
};

export type LiveSignalKey = "buying_intent" | "trust" | "objection" | "call_stage";

export type LiveSignal = {
  key: LiveSignalKey;
  label: string;
  value: string;
  trend?: "up" | "down" | "flat";
};

export type AISuggestionKind =
  | "objection"
  | "trust"
  | "buying"
  | "coaching"
  | "playbook"
  | "listening";

export type AISuggestion = {
  id: string;
  kind: AISuggestionKind;
  title: string;
  importance?: "high" | "medium" | "low";
  body: string;
  script?: string;
  playbookId?: string;
  status: "active" | "used" | "dismissed";
  atMs: number;
};

export type PlaybookChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

export type LeadTimelineEvent = {
  id: string;
  at: string;
  label: string;
  current?: boolean;
};

export type LeadContext = {
  id: string;
  label: string;
  status: string;
  intent: string;
  leadSource: string;
  country: string;
  assigned: string;
  registered: string;
  previousCalls: number;
  lastOutcome: string;
  phoneMasked: string;
  campaign: string;
  concerns: string[];
  interests: string[];
  timeline: LeadTimelineEvent[];
};

export type QueueLead = {
  id: string;
  label: string;
  country: string;
  leadSource: string;
  priority: "high" | "medium" | "low";
  registeredAgo: string;
};

export type DemoSpeed = 1 | 2 | 4;

export type WorkspaceTab = "live" | "queue";

export type PostCallReview = {
  outcome: string;
  intent: string;
  aiScore: number;
  conversionProbability: number;
  primaryObjection: string;
  nextBestAction: string;
  didWell: string[];
  missedAt: string;
  missedClient: string;
  missedAgent: string;
  missedInsight: string;
  tryInsteadOf: string;
  tryInstead: string;
  followUpTitle: string;
  followUpReason: string;
  suggestedWhatsApp: string;
};

export type ProcessingStep = {
  id: string;
  label: string;
  done: boolean;
};

export type CallSessionPhase = "softphone" | "processing" | "review" | "wrapup" | "done";

export type CallSession = {
  id: string;
  companyName: string;
  campaign: string;
  agent: CallParticipant;
  prospect: CallParticipant;
  lead: LeadContext;
  status: AgentStatus;
  phase: CallSessionPhase;
  direction: "outbound" | "inbound";
  connectionQuality: "good" | "fair" | "poor";
  muted: boolean;
  onHold: boolean;
  /** Elapsed call time in ms (increments while CONNECTED) */
  elapsedMs: number;
  stages: CallStage[];
  transcript: TranscriptSegment[];
  activeSpeaker: CallParticipantRole | null;
  signals: LiveSignal[];
  suggestions: AISuggestion[];
  playbookStage: string;
  playbookChecklist: PlaybookChecklistItem[];
  notes: string;
  speed: DemoSpeed;
  processingSteps: ProcessingStep[];
  review: PostCallReview | null;
  /** Where the post-call review came from */
  reviewProvider: "cursor" | "openai" | "stub" | "fixture" | null;
  disposition: CallDisposition | null;
  followUpDate: string;
  followUpTime: string;
  followUpNotes: string;
  keypadOpen: boolean;
  playbookDrawerOpen: boolean;
  managerCanMonitor: boolean;
  managerName: string;
  callsToday: number;
  ftdsToday: number;
  conversionToday: number;
};
