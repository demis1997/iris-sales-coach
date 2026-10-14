export const CALL_STATES = [
  "created",
  "ringing",
  "in_progress",
  "completed",
  "failed",
  "cancelled",
  "missed",
  "provider_unknown",
] as const;
export type CallState = (typeof CALL_STATES)[number];
export const TERMINAL_CALL_STATES = new Set<CallState>([
  "completed",
  "failed",
  "cancelled",
  "missed",
]);
const twilioStates: Record<string, CallState> = {
  queued: "created",
  initiated: "created",
  ringing: "ringing",
  "in-progress": "in_progress",
  completed: "completed",
  failed: "failed",
  busy: "failed",
  canceled: "cancelled",
  "no-answer": "missed",
};
export function providerCallState(status: string): CallState {
  const state = twilioStates[status];
  if (!state) throw new Error("unknown_provider_call_status");
  return state;
}
export function canAdvanceCall(from: CallState, to: CallState) {
  if (from === to) return true;
  if (TERMINAL_CALL_STATES.has(from)) return false;
  if (TERMINAL_CALL_STATES.has(to)) return true;
  const rank: Record<string, number> = {
    created: 0,
    provider_unknown: 0,
    ringing: 1,
    in_progress: 2,
  };
  return rank[to] >= rank[from];
}
