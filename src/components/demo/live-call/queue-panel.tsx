import { Chip, Panel, PanelHeader } from "@/components/iris/primitives";
import type { QueueLead } from "@/lib/demo/live-call/types";

export function QueuePanel({
  leads,
  onCall,
  onSkip,
}: {
  leads: QueueLead[];
  onCall: (id: string) => void;
  onSkip: (id: string) => void;
}) {
  const next = leads[0];

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Queue</h2>
        <p className="text-sm text-muted-foreground">Next outbound leads · Demo Workspace</p>
      </div>

      {next ? (
        <Panel className="border-primary/30">
          <PanelHeader
            title="Next Lead"
            subtitle={next.registeredAgo}
            action={<Chip tone="warn">High Priority</Chip>}
          />
          <div className="space-y-3 p-5">
            <p className="text-2xl font-semibold">{next.label}</p>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span>{next.country}</span>
              <span>·</span>
              <span>{next.leadSource}</span>
              <span>·</span>
              <span className="capitalize">{next.priority} priority</span>
            </div>
            <p className="text-xs text-muted-foreground">Registered: {next.registeredAgo}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => onCall(next.id)}
                className="product-btn-primary"
              >
                CALL
              </button>
              <button
                type="button"
                onClick={() => onSkip(next.id)}
                className="rounded-xl border border-border px-5 py-2.5 text-sm"
              >
                SKIP
              </button>
            </div>
          </div>
        </Panel>
      ) : (
        <Panel className="p-8 text-center text-sm text-muted-foreground">
          Queue empty for this demo session.
        </Panel>
      )}

      {leads.slice(1).map((lead) => (
        <Panel key={lead.id} className="flex items-center justify-between gap-3 px-5 py-4">
          <div>
            <p className="font-medium">{lead.label}</p>
            <p className="text-xs text-muted-foreground">
              {lead.country} · {lead.leadSource} · {lead.registeredAgo}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onCall(lead.id)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs"
            >
              CALL
            </button>
            <button
              type="button"
              onClick={() => onSkip(lead.id)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground"
            >
              SKIP
            </button>
          </div>
        </Panel>
      ))}
    </div>
  );
}
