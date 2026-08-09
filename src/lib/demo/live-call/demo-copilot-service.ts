import type { CallSession } from "./types";
import type { TimelineEvent } from "./timeline";

/** Applies copilot / signal / stage timeline events. */
export const DemoCopilotService = {
  applyEvent(session: CallSession, event: TimelineEvent): CallSession {
    if (event.type === "signals" && event.signals) {
      return { ...session, signals: event.signals.map((s) => ({ ...s })) };
    }

    if (event.type === "stage" && event.stages) {
      return { ...session, stages: event.stages.map((s) => ({ ...s })) };
    }

    if (event.type === "playbook_stage" && event.playbookStage) {
      return { ...session, playbookStage: event.playbookStage };
    }

    if (event.type === "checklist" && event.checklist) {
      return { ...session, playbookChecklist: event.checklist.map((c) => ({ ...c })) };
    }

    if (event.type === "suggestion" && event.suggestion) {
      const existing = session.suggestions.some((s) => s.id === event.suggestion!.id);
      if (existing) return session;
      return {
        ...session,
        suggestions: [...session.suggestions, { ...event.suggestion }],
      };
    }

    return session;
  },

  useSuggestion(session: CallSession, id: string): CallSession {
    return {
      ...session,
      suggestions: session.suggestions.map((s) =>
        s.id === id ? { ...s, status: "used" as const } : s,
      ),
    };
  },

  dismissSuggestion(session: CallSession, id: string): CallSession {
    return {
      ...session,
      suggestions: session.suggestions.map((s) =>
        s.id === id ? { ...s, status: "dismissed" as const } : s,
      ),
    };
  },
};
