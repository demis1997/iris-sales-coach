import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeading, Panel, Chip, Meter } from "@/components/iris/primitives";
import { pipeline } from "@/lib/revenue-os-data";

export const Route = createFileRoute("/crm/pipeline")({
  head: () => ({
    meta: [
      { title: "Pipeline — Artemis CRM" },
      { name: "description", content: "Deal pipeline with AI win probability derived from conversation signals." },
      { property: "og:title", content: "Pipeline — Artemis CRM" },
      { property: "og:description", content: "Win probability from what was actually said on the call." },
    ],
  }),
  component: PipelinePage,
});

function PipelinePage() {
  const total = pipeline.flatMap((s) => s.deals).reduce((a, d) => a + d.value, 0);

  return (
    <>
      <PageHeading
        title="Pipeline"
        subtitle={`€${(total / 1000).toFixed(0)}k across ${pipeline.flatMap((s) => s.deals).length} deals · win probability scored by Artemis AI`}
      />

      <div className="grid gap-3 lg:grid-cols-5">
        {pipeline.map((stage) => {
          const value = stage.deals.reduce((a, d) => a + d.value, 0);
          return (
            <div key={stage.stage} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-medium">{stage.stage}</p>
                <span className="font-mono text-[11px] text-muted-foreground">
                  €{(value / 1000).toFixed(0)}k
                </span>
              </div>
              {stage.deals.map((d) => (
                <Panel key={d.name} className="p-4 transition-colors hover:border-primary/40">
                  <p className="text-sm leading-snug font-medium">{d.name}</p>
                  <p className="mt-2 font-mono text-xs text-muted-foreground">
                    €{(d.value / 1000).toFixed(0)}k
                  </p>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Win probability</span>
                      <span className="font-mono">{d.win}%</span>
                    </div>
                    <Meter value={d.win} />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="grid size-6 place-items-center rounded-full bg-secondary text-[10px] font-semibold text-muted-foreground">
                      {d.owner}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        to="/crm/deal-risk"
                        className="text-[10px] text-primary hover:underline"
                      >
                        Risk intel
                      </Link>
                      <Chip tone={d.win >= 70 ? "good" : d.win >= 50 ? "warn" : "bad"}>
                        {d.win >= 70 ? "On track" : d.win >= 50 ? "Needs push" : "At risk"}
                      </Chip>
                    </div>
                  </div>
                </Panel>
              ))}
              {stage.deals.length === 0 ? (
                <Panel className="grid place-items-center p-6 text-xs text-muted-foreground">
                  No deals
                </Panel>
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
}
