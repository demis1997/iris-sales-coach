import { createFileRoute } from "@tanstack/react-router";
import { PageHeading, Panel, PanelHeader, Meter } from "@/components/iris/primitives";
import { employees } from "@/lib/iris-data";

export const Route = createFileRoute("/manager/coaching")({
  head: () => ({
    meta: [
      { title: "Coaching — Artemis Manager" },
      { name: "description", content: "Assign coaching plans generated from each rep's real conversations." },
      { property: "og:title", content: "Coaching — Artemis Manager" },
      { property: "og:description", content: "Coaching plans written from real calls." },
    ],
  }),
  component: () => (
    <>
      <PageHeading title="Coaching" subtitle="Each plan is generated from the rep's own calls" />
      <div className="grid gap-3 lg:grid-cols-2">
        {employees.slice(0, 6).map((e) => (
          <Panel key={e.name}>
            <PanelHeader title={e.name} subtitle={`Score ${e.score} · ${e.calls} calls`} />
            <div className="space-y-3 p-5">
              <Meter value={e.score} />
              <p className="text-xs text-muted-foreground">
                Focus this week: hold the value frame for two exchanges before discussing price.
              </p>
              <button className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary">
                Assign plan
              </button>
            </div>
          </Panel>
        ))}
      </div>
    </>
  ),
});
