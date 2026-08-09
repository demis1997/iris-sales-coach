import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Panel, PanelHeader } from "@/components/iris/primitives";
import type { CallSession } from "@/lib/demo/live-call/types";
import { cn } from "@/lib/utils";

export function LeadContextPanel({
  session,
  onNotes,
}: {
  session: CallSession;
  onNotes: (v: string) => void;
}) {
  const [playbookOpen, setPlaybookOpen] = useState(true);
  const lead = session.lead;

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto">
      <Panel>
        <PanelHeader title={lead.label} subtitle={`${lead.country} · ${lead.leadSource}`} />
        <div className="space-y-2 px-4 py-3 text-xs">
          {[
            ["Status", lead.status],
            ["Intent", lead.intent],
            ["Lead source", lead.leadSource],
            ["Country", lead.country],
            ["Assigned", lead.assigned],
            ["Registered", lead.registered],
            ["Previous calls", String(lead.previousCalls)],
            ["Last outcome", lead.lastOutcome],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2">
              <span className="text-muted-foreground">{k}</span>
              <span className="text-right font-medium">{v}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Lead timeline" />
        <ul className="space-y-2 px-4 py-3">
          {lead.timeline.map((e) => (
            <li key={e.id} className="flex gap-3 text-xs">
              <span
                className={cn(
                  "w-12 shrink-0 font-mono",
                  e.current ? "text-primary" : "text-muted-foreground",
                )}
              >
                {e.at}
              </span>
              <span className={cn(e.current && "font-semibold text-primary")}>{e.label}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel className="p-4">
        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          AI context
        </p>
        <p className="mt-2 text-xs font-medium">Known concerns</p>
        <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
          {lead.concerns.map((c) => (
            <li key={c}>• {c}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs font-medium">Interest</p>
        <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
          {lead.interests.map((c) => (
            <li key={c}>• {c}</li>
          ))}
        </ul>
      </Panel>

      <Panel className="p-4">
        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          Quick notes
        </p>
        <textarea
          value={session.notes}
          onChange={(e) => onNotes(e.target.value)}
          placeholder="Interested but concerned about withdrawals."
          className="mt-2 min-h-[72px] w-full resize-y rounded-xl border border-border bg-background/50 px-3 py-2 text-xs outline-none focus:border-primary/50"
        />
      </Panel>

      <Panel>
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3 text-left"
          onClick={() => setPlaybookOpen((v) => !v)}
        >
          <div>
            <p className="text-sm font-semibold">Playbook</p>
            <p className="text-[11px] text-muted-foreground">
              Current stage: {session.playbookStage}
            </p>
          </div>
          {playbookOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        </button>
        {playbookOpen ? (
          <ul className="space-y-2 border-t border-border px-4 py-3 text-xs">
            {session.playbookChecklist.map((item) => (
              <li key={item.id} className="flex items-center gap-2">
                <span className={cn(item.done ? "text-success" : "text-muted-foreground")}>
                  {item.done ? "✓" : "○"}
                </span>
                <span className={cn(item.done && "text-muted-foreground line-through")}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </Panel>
    </div>
  );
}
