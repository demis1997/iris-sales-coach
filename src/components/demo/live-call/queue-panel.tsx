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
                Call {next.label.split(" ")[0]}
              </button>
              <button
                type="button"
                onClick={() => onSkip(next.id)}
                className="rounded-xl border border-border px-5 py-2.5 text-sm"
              >
                SKIP
              </button>
            </div>
            {next.label === "James Wilson" ? (
              <div className="mt-4 rounded-xl border border-[#2EE6A6]/25 bg-[#2EE6A6]/8 p-3 text-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#2EE6A6]">
                  AI Brief
                </p>
                <p className="mt-2 leading-relaxed text-[#C5D0E0]">
                  James showed strong interest during his previous conversation but ended the call
                  after asking about withdrawal processing times. Avoid immediately discussing
                  deposit size. Establish trust first. Suggested objective: rebuild trust.
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#8A9BB5]">
                  <div>
                    Previous calls: <span className="text-[#F7FAFF]">3</span>
                  </div>
                  <div>
                    Previous deposit: <span className="text-[#F7FAFF]">€2,500</span>
                  </div>
                  <div>
                    Last objection: <span className="text-[#F7FAFF]">Withdrawal</span>
                  </div>
                  <div>
                    Lead score: <span className="text-[#F7FAFF]">82</span>
                  </div>
                </dl>
              </div>
            ) : null}
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
