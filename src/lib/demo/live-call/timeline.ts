import type { CallStage, LiveSignal, PlaybookChecklistItem, TranscriptSegment, AISuggestion } from "./types";

export type TimelineEventType =
  | "transcript"
  | "transcript_partial"
  | "transcript_finalize"
  | "speaker"
  | "stage"
  | "signals"
  | "suggestion"
  | "checklist"
  | "playbook_stage";

export type TimelineEvent = {
  /** Absolute call time in ms when this fires (from call start) */
  atMs: number;
  type: TimelineEventType;
  segment?: TranscriptSegment;
  partialId?: string;
  partialText?: string;
  finalizeId?: string;
  finalizeText?: string;
  speaker?: "agent" | "prospect" | null;
  stages?: CallStage[];
  signals?: LiveSignal[];
  suggestion?: AISuggestion;
  checklist?: PlaybookChecklistItem[];
  playbookStage?: string;
};

function seg(
  id: string,
  atMs: number,
  speaker: "agent" | "prospect",
  name: string,
  text: string,
  highlight?: TranscriptSegment["highlight"],
): TranscriptSegment {
  const m = Math.floor(atMs / 60000);
  const s = Math.floor((atMs % 60000) / 1000);
  return {
    id,
    atMs,
    atLabel: `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
    speaker,
    name,
    text,
    highlight,
  };
}

/**
 * Deterministic simulation timeline for the Apex Markets live demo.
 * Absolute times align with on-screen call clock.
 */
export const LIVE_CALL_TIMELINE: TimelineEvent[] = [
  {
    atMs: 7 * 60000 + 52 * 1000,
    type: "speaker",
    speaker: "agent",
  },
  {
    atMs: 7 * 60000 + 52 * 1000,
    type: "transcript",
    segment: seg(
      "tx-1",
      7 * 60000 + 52 * 1000,
      "agent",
      "Maria",
      "Before we go further, what made you register with us today?",
      "good",
    ),
  },
  {
    atMs: 7 * 60000 + 56 * 1000,
    type: "speaker",
    speaker: null,
  },
  {
    atMs: 7 * 60000 + 58 * 1000,
    type: "speaker",
    speaker: "prospect",
  },
  {
    atMs: 7 * 60000 + 58 * 1000,
    type: "transcript",
    segment: seg(
      "tx-2",
      7 * 60000 + 58 * 1000,
      "prospect",
      "Client",
      "I've been looking at trading for a while. I just haven't really trusted any of these platforms.",
    ),
  },
  {
    atMs: 8 * 60000 + 2 * 1000,
    type: "speaker",
    speaker: null,
  },
  {
    atMs: 8 * 60000 + 5 * 1000,
    type: "speaker",
    speaker: "agent",
  },
  {
    atMs: 8 * 60000 + 5 * 1000,
    type: "transcript",
    segment: seg(
      "tx-3",
      8 * 60000 + 5 * 1000,
      "agent",
      "Maria",
      "That's completely understandable. Have you traded before?",
      "good",
    ),
  },
  {
    atMs: 8 * 60000 + 9 * 1000,
    type: "speaker",
    speaker: null,
  },
  {
    atMs: 8 * 60000 + 12 * 1000,
    type: "speaker",
    speaker: "prospect",
  },
  {
    atMs: 8 * 60000 + 12 * 1000,
    type: "transcript_partial",
    partialId: "tx-4",
    partialText: "My biggest concern is getting my money…",
    segment: seg(
      "tx-4",
      8 * 60000 + 12 * 1000,
      "prospect",
      "Client",
      "My biggest concern is getting my money…",
      "objection",
    ),
  },
  {
    atMs: 8 * 60000 + 14 * 1000,
    type: "transcript_finalize",
    finalizeId: "tx-4",
    finalizeText: "My biggest concern is getting my money back out.",
  },
  {
    atMs: 8 * 60000 + 14 * 500,
    type: "speaker",
    speaker: null,
  },
  {
    atMs: 8 * 60000 + 14 * 1000 + 400,
    type: "signals",
    signals: [
      { key: "buying_intent", label: "Buying Intent", value: "High", trend: "flat" },
      { key: "trust", label: "Trust", value: "Medium", trend: "down" },
      { key: "objection", label: "Objection", value: "Withdrawal", trend: "up" },
      { key: "call_stage", label: "Call Stage", value: "Objection Handling", trend: "flat" },
    ],
  },
  {
    atMs: 8 * 60000 + 14 * 1000 + 500,
    type: "suggestion",
    suggestion: {
      id: "sug-1",
      kind: "objection",
      title: "Objection detected",
      importance: "high",
      body: "Withdrawal concern\n\nRecommended approach\nResolve the trust concern before discussing funding.",
      script:
        "That's completely understandable. Let me explain exactly how our withdrawal process works before we discuss anything else.",
      status: "active",
      atMs: 8 * 60000 + 14 * 1000,
    },
  },
  {
    atMs: 8 * 60000 + 18 * 1000,
    type: "checklist",
    checklist: [
      { id: "ack", label: "Acknowledge concern", done: true },
      { id: "explain", label: "Explain withdrawal process", done: false },
      { id: "confirm", label: "Confirm understanding", done: false },
      { id: "objective", label: "Return to customer's objective", done: false },
    ],
  },
  {
    atMs: 8 * 60000 + 20 * 1000,
    type: "speaker",
    speaker: "agent",
  },
  {
    atMs: 8 * 60000 + 20 * 1000,
    type: "transcript",
    segment: seg(
      "tx-5",
      8 * 60000 + 20 * 1000,
      "agent",
      "Maria",
      "That's completely fair — withdrawals are the most important part to understand. Once verified, you request from the portal and we process within the published timeframe.",
    ),
  },
  {
    atMs: 8 * 60000 + 24 * 1000,
    type: "checklist",
    checklist: [
      { id: "ack", label: "Acknowledge concern", done: true },
      { id: "explain", label: "Explain withdrawal process", done: true },
      { id: "confirm", label: "Confirm understanding", done: false },
      { id: "objective", label: "Return to customer's objective", done: false },
    ],
  },
  {
    atMs: 8 * 60000 + 26 * 1000,
    type: "speaker",
    speaker: "prospect",
  },
  {
    atMs: 8 * 60000 + 26 * 1000,
    type: "transcript",
    segment: seg(
      "tx-6",
      8 * 60000 + 26 * 1000,
      "prospect",
      "Client",
      "I've heard stories about brokers making withdrawals difficult.",
      "risk",
    ),
  },
  {
    atMs: 8 * 60000 + 27 * 1000,
    type: "signals",
    signals: [
      { key: "buying_intent", label: "Buying Intent", value: "High", trend: "flat" },
      { key: "trust", label: "Trust", value: "Low", trend: "down" },
      { key: "objection", label: "Objection", value: "Withdrawal", trend: "up" },
      { key: "call_stage", label: "Call Stage", value: "Objection Handling", trend: "flat" },
    ],
  },
  {
    atMs: 8 * 60000 + 27 * 1000 + 300,
    type: "suggestion",
    suggestion: {
      id: "sug-2",
      kind: "trust",
      title: "Trust risk ↑",
      importance: "high",
      body: "Don't push for a deposit yet.\n\nAddress credibility and withdrawal procedure first.",
      playbookId: "pb-withdrawal",
      status: "active",
      atMs: 8 * 60000 + 27 * 1000,
    },
  },
  {
    atMs: 8 * 60000 + 30 * 1000,
    type: "speaker",
    speaker: "agent",
  },
  {
    atMs: 8 * 60000 + 30 * 1000,
    type: "transcript",
    segment: seg(
      "tx-7",
      8 * 60000 + 30 * 1000,
      "agent",
      "Maria",
      "Those stories are exactly why I want to be clear. I'll send the withdrawal steps in writing so you can keep them — then you decide if we continue.",
      "good",
    ),
  },
  {
    atMs: 8 * 60000 + 34 * 1000,
    type: "speaker",
    speaker: "prospect",
  },
  {
    atMs: 8 * 60000 + 34 * 1000,
    type: "transcript",
    segment: seg(
      "tx-8",
      8 * 60000 + 34 * 1000,
      "prospect",
      "Client",
      "Okay, that actually makes sense.",
      "opportunity",
    ),
  },
  {
    atMs: 8 * 60000 + 34 * 1000 + 400,
    type: "signals",
    signals: [
      { key: "buying_intent", label: "Buying Intent", value: "Very High", trend: "up" },
      { key: "trust", label: "Trust", value: "Medium", trend: "up" },
      { key: "objection", label: "Objection", value: "Resolving", trend: "down" },
      { key: "call_stage", label: "Call Stage", value: "Closing", trend: "up" },
    ],
  },
  {
    atMs: 8 * 60000 + 34 * 1000 + 500,
    type: "stage",
    stages: [
      { id: "opening", label: "Opening", state: "complete" },
      { id: "discovery", label: "Discovery", state: "complete" },
      { id: "qualification", label: "Qualification", state: "complete" },
      { id: "objection", label: "Objection Handling", state: "complete" },
      { id: "closing", label: "Closing", state: "active" },
      { id: "followup", label: "Follow-up", state: "upcoming" },
    ],
  },
  {
    atMs: 8 * 60000 + 34 * 1000 + 600,
    type: "playbook_stage",
    playbookStage: "Closing",
  },
  {
    atMs: 8 * 60000 + 35 * 1000,
    type: "suggestion",
    suggestion: {
      id: "sug-3",
      kind: "buying",
      title: "Buying signal detected",
      importance: "high",
      body: "Suggested next step\nMove toward commitment.",
      script: "Great. Would you like me to walk you through getting the account ready now?",
      status: "active",
      atMs: 8 * 60000 + 35 * 1000,
    },
  },
  {
    atMs: 8 * 60000 + 35 * 1000 + 200,
    type: "checklist",
    checklist: [
      { id: "ack", label: "Acknowledge concern", done: true },
      { id: "explain", label: "Explain withdrawal process", done: true },
      { id: "confirm", label: "Confirm understanding", done: true },
      { id: "objective", label: "Return to customer's objective", done: false },
    ],
  },
  {
    atMs: 8 * 60000 + 38 * 1000,
    type: "speaker",
    speaker: "agent",
  },
  {
    atMs: 8 * 60000 + 38 * 1000,
    type: "transcript",
    segment: seg(
      "tx-9",
      8 * 60000 + 38 * 1000,
      "agent",
      "Maria",
      "Great, and another feature we offer is a beginner dashboard with guided charts…",
      "opportunity",
    ),
  },
  {
    atMs: 8 * 60000 + 40 * 1000,
    type: "suggestion",
    suggestion: {
      id: "sug-4",
      kind: "coaching",
      title: "Coaching signal",
      importance: "high",
      body: "Buying signal missed.\n\nThe prospect showed readiness to proceed. Consider moving toward a close rather than adding more product information.",
      status: "active",
      atMs: 8 * 60000 + 40 * 1000,
    },
  },
  {
    atMs: 8 * 60000 + 42 * 1000,
    type: "speaker",
    speaker: null,
  },
];

/** Events for a fresh dial from queue (relative from connect at 0). */
export const FRESH_CALL_TIMELINE: TimelineEvent[] = LIVE_CALL_TIMELINE.map((e) => ({
  ...e,
  atMs: Math.max(0, e.atMs - (7 * 60000 + 48 * 1000)),
  segment: e.segment
    ? {
        ...e.segment,
        atMs: Math.max(0, e.segment.atMs - (7 * 60000 + 48 * 1000)),
        atLabel: formatClock(Math.max(0, e.segment.atMs - (7 * 60000 + 48 * 1000))),
      }
    : undefined,
  suggestion: e.suggestion
    ? {
        ...e.suggestion,
        atMs: Math.max(0, e.suggestion.atMs - (7 * 60000 + 48 * 1000)),
      }
    : undefined,
}));

function formatClock(ms: number) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatCallClock(ms: number) {
  return formatClock(Math.max(0, ms));
}
