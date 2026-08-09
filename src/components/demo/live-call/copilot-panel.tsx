import { Chip, Panel, PanelHeader } from "@/components/iris/primitives";
import { PLAYBOOK_WITHDRAWAL } from "@/lib/demo/live-call/fixtures";
import type { AISuggestion, CallSession, LiveSignal } from "@/lib/demo/live-call/types";
import { cn } from "@/lib/utils";

export function CopilotPanel({
  session,
  onUse,
  onDismiss,
  onOpenPlaybook,
  onClosePlaybook,
}: {
  session: CallSession;
  onUse: (id: string) => void;
  onDismiss: (id: string) => void;
  onOpenPlaybook: () => void;
  onClosePlaybook: () => void;
}) {
  const active = session.suggestions.filter((s) => s.status !== "dismissed");

  return (
    <div className="relative flex h-full min-h-0 flex-col gap-3">
      <Panel className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <PanelHeader
          title="Artemis Copilot"
          subtitle="Listening to the conversation"
          action={<Chip tone="iris">Simulated AI</Chip>}
        />

        <div className="grid grid-cols-2 gap-2 border-b border-border px-4 py-3">
          {session.signals.map((sig) => (
            <SignalChip key={sig.key} signal={sig} />
          ))}
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
          {active.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">Listening…</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Suggestions appear as the conversation develops.
              </p>
            </div>
          ) : null}

          {active.map((s) => (
            <SuggestionCard
              key={s.id}
              suggestion={s}
              onUse={() => onUse(s.id)}
              onDismiss={() => onDismiss(s.id)}
              onOpenPlaybook={s.playbookId ? onOpenPlaybook : undefined}
            />
          ))}
        </div>
      </Panel>

      {session.playbookDrawerOpen ? (
        <div className="absolute inset-x-0 bottom-0 z-20 max-h-[70%] overflow-y-auto rounded-2xl border border-primary/30 bg-card p-4 shadow-2xl">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-primary">Relevant playbook</p>
              <h3 className="text-sm font-semibold">{PLAYBOOK_WITHDRAWAL.title}</h3>
            </div>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={onClosePlaybook}
            >
              Close
            </button>
          </div>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-xs leading-relaxed text-muted-foreground">
            {PLAYBOOK_WITHDRAWAL.body}
          </pre>
        </div>
      ) : null}
    </div>
  );
}

function SignalChip({ signal }: { signal: LiveSignal }) {
  const trend =
    signal.trend === "up" ? "↑" : signal.trend === "down" ? "↓" : "";
  return (
    <div className="rounded-xl border border-border bg-secondary/20 px-2.5 py-2">
      <p className="text-[10px] tracking-wide text-muted-foreground uppercase">{signal.label}</p>
      <p className="mt-0.5 text-xs font-semibold">
        {signal.value} {trend}
      </p>
    </div>
  );
}

function SuggestionCard({
  suggestion,
  onUse,
  onDismiss,
  onOpenPlaybook,
}: {
  suggestion: AISuggestion;
  onUse: () => void;
  onDismiss: () => void;
  onOpenPlaybook?: () => void;
}) {
  const used = suggestion.status === "used";
  return (
    <div
      className={cn(
        "rounded-xl border p-3 text-sm",
        suggestion.kind === "coaching"
          ? "border-warning/30 bg-warning/8"
          : "border-[#18C4FF]/25 bg-[#18C4FF]/8",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Chip tone={suggestion.kind === "coaching" ? "warn" : "iris"}>
          {suggestion.title}
        </Chip>
        {suggestion.importance === "high" ? (
          <span className="text-[10px] font-medium text-warning">High importance</span>
        ) : null}
        {used ? <span className="text-[10px] font-semibold text-success">Suggestion used ✓</span> : null}
      </div>
      <p className="mt-2 whitespace-pre-line text-xs leading-relaxed">{suggestion.body}</p>
      {suggestion.script ? (
        <p className="mt-2 rounded-lg border border-border/60 bg-background/40 px-2.5 py-2 text-xs italic text-muted-foreground">
          Suggested response: “{suggestion.script}”
        </p>
      ) : null}
      {suggestion.playbookId ? (
        <button
          type="button"
          onClick={onOpenPlaybook}
          className="mt-2 text-xs font-semibold text-primary hover:underline"
        >
          Relevant playbook · Handling withdrawal concerns [Open]
        </button>
      ) : null}
      {!used && suggestion.script ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onUse}
            className="product-btn-primary !rounded-lg !px-3 !py-1.5 text-[11px]"
          >
            Use suggestion
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg border border-border px-3 py-1.5 text-[11px]"
          >
            Dismiss
          </button>
        </div>
      ) : null}
      {!used && !suggestion.script ? (
        <div className="mt-3">
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg border border-border px-3 py-1.5 text-[11px]"
          >
            Dismiss
          </button>
        </div>
      ) : null}
    </div>
  );
}
