import type { CallSession, TranscriptSegment } from "./types";
import type { TimelineEvent } from "./timeline";

/** Applies deterministic timeline events into session transcript state. */
export const DemoTranscriptionService = {
  applyEvent(session: CallSession, event: TimelineEvent): CallSession {
    if (event.type === "transcript" && event.segment) {
      return appendSegment(session, { ...event.segment, partial: false });
    }

    if (event.type === "transcript_partial" && event.segment) {
      return appendSegment(session, { ...event.segment, partial: true });
    }

    if (event.type === "transcript_finalize" && event.finalizeId && event.finalizeText) {
      return {
        ...session,
        transcript: session.transcript.map((line) =>
          line.id === event.finalizeId
            ? { ...line, text: event.finalizeText!, partial: false }
            : line,
        ),
      };
    }

    if (event.type === "speaker") {
      return { ...session, activeSpeaker: event.speaker ?? null };
    }

    return session;
  },
};

function appendSegment(session: CallSession, segment: TranscriptSegment): CallSession {
  if (session.transcript.some((t) => t.id === segment.id)) {
    return {
      ...session,
      transcript: session.transcript.map((t) => (t.id === segment.id ? segment : t)),
    };
  }
  return { ...session, transcript: [...session.transcript, segment] };
}
