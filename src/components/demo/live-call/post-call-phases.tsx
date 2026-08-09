import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Chip, Panel, PanelHeader } from "@/components/iris/primitives";
import type { CallDisposition, CallSession } from "@/lib/demo/live-call/types";
import { formatMs } from "./softphone-bits";

const DISPOSITIONS: { id: CallDisposition; label: string }[] = [
  { id: "ftd", label: "FTD" },
  { id: "follow_up", label: "Follow-up" },
  { id: "not_interested", label: "Not Interested" },
  { id: "no_answer", label: "No Answer" },
  { id: "wrong_number", label: "Wrong Number" },
  { id: "needs_info", label: "Needs More Information" },
  { id: "compliance", label: "Compliance Review" },
];

export function ProcessingPhase({ session }: { session: CallSession }) {
  return (
    <Panel className="mx-auto max-w-lg p-8 text-center">
      <Chip tone="iris">Artemis Coach</Chip>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight">Call ended</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Duration: <span className="font-mono text-foreground">{formatMs(session.elapsedMs)}</span>
      </p>
      <p className="mt-6 text-sm text-muted-foreground">
        Reading the transcript and generating coaching…
      </p>
      <ul className="mx-auto mt-4 max-w-xs space-y-2 text-left text-sm">
        {session.processingSteps.map((s) => (
          <li key={s.id} className="flex items-center gap-2">
            <span className={s.done ? "text-success" : "text-muted-foreground"}>{s.done ? "✓" : "○"}</span>
            {s.label}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function ReviewPhase({
  session,
  onContinue,
}: {
  session: CallSession;
  onContinue: () => void;
}) {
  const review = session.review;
  if (!review) return null;

  const providerLabel =
    session.reviewProvider === "cursor"
      ? "Artemis Coach (Cursor)"
      : session.reviewProvider === "openai"
        ? "Artemis Coach (OpenAI)"
        : session.reviewProvider === "stub"
          ? "Stub coaching"
          : "Demo fixture";

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Call Review</h2>
          <p className="text-sm text-muted-foreground">
            {session.prospect.name} · Coached from this call’s transcript
          </p>
        </div>
        <Chip tone="iris">{providerLabel}</Chip>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["Outcome", review.outcome],
          ["Intent", review.intent],
          ["AI Score", `${review.aiScore} / 100`],
          ["Conversion Probability", `${review.conversionProbability}%`],
          ["Primary Objection", review.primaryObjection],
          ["Next Best Action", review.nextBestAction],
        ].map(([k, v]) => (
          <Panel key={k} className="p-3">
            <p className="text-[10px] tracking-wide text-muted-foreground uppercase">{k}</p>
            <p className="mt-1 text-sm font-semibold">{v}</p>
          </Panel>
        ))}
      </div>

      <Panel className="p-5">
        <p className="text-xs font-semibold text-success">What you did well</p>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          {review.didWell.map((item) => (
            <li key={item}>✓ {item}</li>
          ))}
        </ul>
      </Panel>

      <Panel className="border-warning/40 bg-warning/5 p-5">
        <p className="text-xs font-semibold tracking-wide text-warning uppercase">
          Highest-leverage miss
        </p>
        <h3 className="mt-2 text-xl font-semibold">{review.missedInsight}</h3>
        <p className="mt-2 font-mono text-xs text-primary">{review.missedAt}</p>
        <p className="mt-3 text-sm">
          Prospect: <span className="text-muted-foreground">“{review.missedClient}”</span>
        </p>
        <p className="mt-2 text-sm">
          Rep: <span className="text-destructive">“{review.missedAgent}”</span>
        </p>
      </Panel>

      <Panel className="p-5">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Try this instead
        </p>
        <p className="mt-2 text-sm text-destructive">Instead of: “{review.tryInsteadOf}”</p>
        <p className="mt-2 text-sm text-success">Try: “{review.tryInstead}”</p>
          <Link
            to="/demo/agent/practice"
            search={{ scenario: "high-intent-trust" }}
            className="mt-4 inline-flex product-btn-primary !px-4 !py-2 text-xs"
          >
            Practice this →
          </Link>
      </Panel>

      <Panel>
        <PanelHeader title="Next best action" subtitle={review.followUpTitle} />
        <div className="space-y-3 p-5 text-sm">
          <p className="text-muted-foreground">{review.followUpReason}</p>
          <div className="rounded-xl border border-border bg-secondary/20 px-3 py-2 text-xs leading-relaxed">
            Suggested WhatsApp:
            <p className="mt-1 text-sm text-foreground">“{review.suggestedWhatsApp}”</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-xl border border-border px-3 py-1.5 text-xs"
              onClick={() => {
                void navigator.clipboard.writeText(review.suggestedWhatsApp);
                toast.success("Copied (demo)");
              }}
            >
              Copy
            </button>
            <button
              type="button"
              className="product-btn-primary !px-3 !py-1.5 text-xs"
              onClick={() => toast.success("Follow-up created (demo)")}
            >
              Create Follow-Up
            </button>
          </div>
        </div>
      </Panel>

      <button
        type="button"
        onClick={onContinue}
        className="product-btn-primary"
      >
        Select call outcome →
      </button>
    </div>
  );
}

export function WrapUpPhase({
  session,
  onDisposition,
  onFollowUp,
  onSave,
}: {
  session: CallSession;
  onDisposition: (d: CallDisposition) => void;
  onFollowUp: (field: "followUpDate" | "followUpTime" | "followUpNotes", value: string) => void;
  onSave: () => void;
}) {
  return (
    <Panel className="mx-auto max-w-lg">
      <PanelHeader title="Select Outcome" subtitle="Wrap-up · CRM update" />
      <div className="grid gap-2 p-4 sm:grid-cols-2">
        {DISPOSITIONS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => onDisposition(d.id)}
            className={
              session.disposition === d.id
                ? "rounded-xl border border-primary bg-primary/15 px-3 py-2 text-left text-sm"
                : "rounded-xl border border-border px-3 py-2 text-left text-sm hover:bg-secondary/40"
            }
          >
            {d.label}
          </button>
        ))}
      </div>
      {session.disposition === "follow_up" ? (
        <div className="space-y-3 border-t border-border px-4 py-4">
          <label className="block text-xs">
            Date
            <input
              type="date"
              value={session.followUpDate}
              onChange={(e) => onFollowUp("followUpDate", e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs">
            Time
            <input
              type="time"
              value={session.followUpTime}
              onChange={(e) => onFollowUp("followUpTime", e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs">
            Notes
            <textarea
              value={session.followUpNotes}
              onChange={(e) => onFollowUp("followUpNotes", e.target.value)}
              className="mt-1 min-h-[72px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
        </div>
      ) : null}
      <div className="border-t border-border px-4 py-4">
        <button
          type="button"
          disabled={!session.disposition}
          onClick={onSave}
          className="product-btn-primary disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </Panel>
  );
}

export function DonePhase({ onAgain, onQueue }: { onAgain: () => void; onQueue: () => void }) {
  return (
    <Panel className="mx-auto max-w-lg p-8 text-center">
      <p className="text-success">✓ CRM updated</p>
      <h2 className="mt-3 text-xl font-semibold">Wrap-up complete</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Ready for the next lead — or reopen the live workspace story.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={onQueue}
          className="product-btn-primary"
        >
          Open queue
        </button>
        <button type="button" onClick={onAgain} className="rounded-xl border border-border px-4 py-2 text-sm">
          Replay live call
        </button>
        <Link to="/demo/agent" className="rounded-xl border border-border px-4 py-2 text-sm">
          Back to Today
        </Link>
      </div>
    </Panel>
  );
}
