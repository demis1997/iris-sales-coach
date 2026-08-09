import {
  createInitialSession,
  LEAD_10821,
  POST_CALL_REVIEW,
  PROCESSING_STEPS,
  QUEUE_LEADS,
} from "./fixtures";
import { DemoCopilotService } from "./demo-copilot-service";
import { DemoTranscriptionService } from "./demo-transcription-service";
import {
  FRESH_CALL_TIMELINE,
  LIVE_CALL_TIMELINE,
  type TimelineEvent,
} from "./timeline";
import type {
  AgentStatus,
  CallDisposition,
  CallSession,
  DemoSpeed,
  QueueLead,
} from "./types";

const TICK_MS = 250;

export type DemoCallEngineSnapshot = {
  session: CallSession;
  queue: QueueLead[];
  tab: "live" | "queue";
  timelineMode: "midcall" | "fresh";
};

type Listener = (snap: DemoCallEngineSnapshot) => void;

/**
 * Demo softphone + timeline state machine.
 * Swap internals later for WebRTC / real STT / backend AI.
 */
export class DemoCallService {
  private session: CallSession;
  private queue: QueueLead[];
  private tab: "live" | "queue" = "live";
  private timelineMode: "midcall" | "fresh" = "midcall";
  private applied = new Set<string>();
  private timer: ReturnType<typeof setInterval> | null = null;
  private listeners = new Set<Listener>();
  private processingTimers: ReturnType<typeof setTimeout>[] = [];

  constructor(mode: "midcall" | "idle" = "midcall") {
    this.session = createInitialSession(mode === "midcall" ? "midcall" : "idle");
    this.queue = QUEUE_LEADS.map((q) => ({ ...q }));
    this.timelineMode = mode === "midcall" ? "midcall" : "fresh";
    if (mode === "midcall") this.startTicker();
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }

  snapshot(): DemoCallEngineSnapshot {
    return {
      session: this.session,
      queue: this.queue,
      tab: this.tab,
      timelineMode: this.timelineMode,
    };
  }

  private emit() {
    const snap = this.snapshot();
    this.listeners.forEach((l) => l(snap));
  }

  private setSession(next: CallSession) {
    this.session = next;
    this.emit();
  }

  private timeline(): TimelineEvent[] {
    return this.timelineMode === "midcall" ? LIVE_CALL_TIMELINE : FRESH_CALL_TIMELINE;
  }

  private eventKey(event: TimelineEvent, index: number) {
    return `${event.type}:${event.atMs}:${event.segment?.id ?? event.suggestion?.id ?? event.finalizeId ?? index}`;
  }

  private startTicker() {
    this.stopTicker();
    this.timer = setInterval(() => this.tick(), TICK_MS);
  }

  private stopTicker() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private tick() {
    const s = this.session;
    if (s.phase !== "softphone") return;
    if (s.status !== "CONNECTED" && s.status !== "DIALING" && s.status !== "RINGING") return;
    if (s.onHold) return;

    const step = TICK_MS * s.speed;
    const nextElapsed = s.elapsedMs + step;
    let next = { ...s, elapsedMs: nextElapsed };

    if (s.status === "DIALING" && nextElapsed >= 900) {
      next = { ...next, status: "RINGING" as AgentStatus, elapsedMs: 0 };
    } else if (s.status === "RINGING" && nextElapsed >= 2000) {
      next = { ...next, status: "CONNECTED" as AgentStatus, elapsedMs: 0 };
      this.timelineMode = "fresh";
      this.applied.clear();
    }

    if (next.status === "CONNECTED") {
      next = this.applyDueEvents(next);
    }

    this.setSession(next);
  }

  private applyDueEvents(session: CallSession): CallSession {
    let next = session;
    this.timeline().forEach((event, index) => {
      const key = this.eventKey(event, index);
      if (this.applied.has(key)) return;
      if (event.atMs > session.elapsedMs) return;
      this.applied.add(key);
      next = DemoTranscriptionService.applyEvent(next, event);
      next = DemoCopilotService.applyEvent(next, event);
    });
    return next;
  }

  setTab(tab: "live" | "queue") {
    this.tab = tab;
    this.emit();
  }

  setSpeed(speed: DemoSpeed) {
    this.setSession({ ...this.session, speed });
  }

  setNotes(notes: string) {
    this.setSession({ ...this.session, notes });
  }

  toggleMute() {
    this.setSession({ ...this.session, muted: !this.session.muted });
  }

  toggleKeypad() {
    this.setSession({ ...this.session, keypadOpen: !this.session.keypadOpen });
  }

  toggleHold() {
    const onHold = !this.session.onHold;
    this.setSession({
      ...this.session,
      onHold,
      status: onHold ? "ON_HOLD" : "CONNECTED",
      activeSpeaker: onHold ? null : this.session.activeSpeaker,
    });
  }

  openPlaybookDrawer(open = true) {
    this.setSession({ ...this.session, playbookDrawerOpen: open });
  }

  useSuggestion(id: string) {
    this.setSession(DemoCopilotService.useSuggestion(this.session, id));
  }

  dismissSuggestion(id: string) {
    this.setSession(DemoCopilotService.dismissSuggestion(this.session, id));
  }

  /** Jump into mid-call objection story (Continue selling). */
  startMidCall() {
    this.cleanupProcessing();
    this.applied.clear();
    this.timelineMode = "midcall";
    this.tab = "live";
    this.session = createInitialSession("midcall");
    this.startTicker();
    this.emit();
  }

  dialFromQueue(leadId: string) {
    const lead = this.queue.find((q) => q.id === leadId);
    if (!lead) return;
    this.cleanupProcessing();
    this.applied.clear();
    this.timelineMode = "fresh";
    this.tab = "live";
    const base = createInitialSession("idle");
    this.session = {
      ...base,
      status: "DIALING",
      phase: "softphone",
      elapsedMs: 0,
      prospect: {
        id: lead.id,
        role: "prospect",
        name: lead.label,
        label: "Prospect",
      },
      lead: {
        ...LEAD_10821,
        id: lead.id,
        label: lead.label,
        country: lead.country,
        leadSource: lead.leadSource,
        registered: lead.registeredAgo,
        previousCalls: 0,
        lastOutcome: "New lead",
        phoneMasked: lead.country === "France" ? "+33 ••• ••• 1091" : "+31 ••• ••• 9221",
        timeline: [
          { id: "n1", at: "NOW", label: "Registered", current: false },
          { id: "n2", at: "NOW", label: "Assigned to Maria" },
          { id: "n3", at: "NOW", label: "Live dial", current: true },
        ],
        concerns: ["Unknown"],
        interests: ["Forex"],
      },
      stages: [
        { id: "opening", label: "Opening", state: "active" },
        { id: "discovery", label: "Discovery", state: "upcoming" },
        { id: "qualification", label: "Qualification", state: "upcoming" },
        { id: "objection", label: "Objection Handling", state: "upcoming" },
        { id: "closing", label: "Closing", state: "upcoming" },
        { id: "followup", label: "Follow-up", state: "upcoming" },
      ],
      signals: [
        { key: "buying_intent", label: "Buying Intent", value: "Unknown", trend: "flat" },
        { key: "trust", label: "Trust", value: "Unknown", trend: "flat" },
        { key: "objection", label: "Objection", value: "None yet", trend: "flat" },
        { key: "call_stage", label: "Call Stage", value: "Opening", trend: "flat" },
      ],
      playbookStage: "Opening",
      playbookChecklist: [
        { id: "greet", label: "Confirm identity & consent", done: false },
        { id: "purpose", label: "State call purpose", done: false },
        { id: "discover", label: "Ask why they registered", done: false },
        { id: "listen", label: "Listen before pitching", done: false },
      ],
    };
    this.queue = this.queue.filter((q) => q.id !== leadId);
    this.startTicker();
    this.emit();
  }

  skipQueueLead(leadId: string) {
    this.queue = this.queue.filter((q) => q.id !== leadId);
    this.emit();
  }

  endCall() {
    if (this.session.phase !== "softphone") return;
    if (
      this.session.status !== "CONNECTED" &&
      this.session.status !== "ON_HOLD" &&
      this.session.status !== "RINGING" &&
      this.session.status !== "DIALING"
    ) {
      return;
    }

    this.stopTicker();
    const durationMs = this.session.elapsedMs;
    const transcriptText = this.session.transcript
      .map((line) => {
        const label = line.speaker === "agent" ? "Rep" : "Prospect";
        return `${label}: ${line.text}`;
      })
      .join("\n");

    this.setSession({
      ...this.session,
      status: "WRAP_UP",
      phase: "processing",
      onHold: false,
      muted: false,
      activeSpeaker: null,
      keypadOpen: false,
      processingSteps: PROCESSING_STEPS.map((s) => ({ ...s, done: false })),
      elapsedMs: durationMs,
      reviewProvider: null,
    });

    const delays = [400, 800, 1200, 1600];
    PROCESSING_STEPS.forEach((step, i) => {
      const t = setTimeout(() => {
        this.setSession({
          ...this.session,
          processingSteps: this.session.processingSteps.map((p) =>
            p.id === step.id ? { ...p, done: true } : p,
          ),
        });
      }, delays[i] / this.session.speed);
      this.processingTimers.push(t);
    });

    const done = setTimeout(() => {
      void this.finishWithCoach(transcriptText);
    }, 2200 / this.session.speed);
    this.processingTimers.push(done);
  }

  private async finishWithCoach(transcriptText: string) {
    const fallback = () => {
      this.setSession({
        ...this.session,
        phase: "review",
        review: POST_CALL_REVIEW,
        reviewProvider: "fixture",
        processingSteps: PROCESSING_STEPS.map((s) => ({ ...s, done: true })),
      });
    };

    if (!transcriptText || transcriptText.trim().length < 20) {
      fallback();
      return;
    }

    try {
      const { coachTranscript } = await import("@/lib/ai/coach.functions");
      const result = await coachTranscript({
        data: {
          transcript: transcriptText,
          repName: this.session.agent.name,
          product: "Apex Markets trading account",
          callType: "forex outbound",
          icp: "High-intent forex lead",
          contactName: this.session.prospect.name,
          contactCompany: this.session.companyName,
        },
      });

      this.setSession({
        ...this.session,
        phase: "review",
        review: result.review,
        reviewProvider: result.provider,
        processingSteps: PROCESSING_STEPS.map((s) => ({ ...s, done: true })),
      });
    } catch (err) {
      console.warn("Live coach failed — using fixture review", err);
      fallback();
    }
  }

  continueToWrapUp() {
    this.setSession({ ...this.session, phase: "wrapup" });
  }

  setDisposition(disposition: CallDisposition) {
    this.setSession({ ...this.session, disposition });
  }

  setFollowUp(field: "followUpDate" | "followUpTime" | "followUpNotes", value: string) {
    this.setSession({ ...this.session, [field]: value });
  }

  saveDisposition() {
    this.setSession({
      ...this.session,
      phase: "done",
      status: "AVAILABLE",
      callsToday: this.session.callsToday + 1,
    });
  }

  resetToAvailable() {
    this.cleanupProcessing();
    this.stopTicker();
    this.applied.clear();
    this.session = createInitialSession("idle");
    this.tab = "queue";
    this.emit();
  }

  private cleanupProcessing() {
    this.processingTimers.forEach(clearTimeout);
    this.processingTimers = [];
  }

  destroy() {
    this.stopTicker();
    this.cleanupProcessing();
    this.listeners.clear();
  }
}

export const demoCallServiceFactory = {
  createMidCall: () => new DemoCallService("midcall"),
  createIdle: () => new DemoCallService("idle"),
};
