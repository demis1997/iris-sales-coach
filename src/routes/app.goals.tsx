import { createFileRoute } from "@tanstack/react-router";
import { Target, Sparkles } from "lucide-react";
import { PageHeading, Panel, PanelHeader, Meter, Chip } from "@/components/iris/primitives";
import { goals } from "@/lib/iris-data";

export const Route = createFileRoute("/app/goals")({
  head: () => ({
    meta: [
      { title: "Goals — Iris Rep Workspace" },
      { name: "description", content: "Track personal sales goals set with your AI coach." },
      { property: "og:title", content: "Goals — Iris Rep Workspace" },
      { property: "og:description", content: "Track personal sales goals set with your AI coach." },
    ],
  }),
  component: GoalsPage,
});

function GoalsPage() {
  return (
    <>
      <PageHeading
        title="Goals"
        subtitle="Set with Iris on July 1 · reviewed automatically every Friday"
        action={
          <button className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary">
            Add goal
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.current / g.target) * 100));
            return (
              <Panel key={g.title} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary/12">
                      <Target className="size-4 text-primary" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{g.title}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                        {g.current}
                        {g.unit} of {g.target}
                        {g.unit}
                      </p>
                    </div>
                  </div>
                  <Chip tone={pct >= 100 ? "good" : pct >= 70 ? "iris" : "warn"}>{pct}%</Chip>
                </div>
                <div className="mt-4">
                  <Meter value={pct} />
                </div>
              </Panel>
            );
          })}
        </div>

        <Panel>
          <PanelHeader title="Iris goal review" subtitle="Auto-generated Friday brief" />
          <div className="space-y-3 p-5 text-sm text-muted-foreground">
            <p className="flex gap-2">
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
              Confidence is 2 points from target — you'll hit it next week at the current rate.
            </p>
            <p className="flex gap-2">
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
              Objection handling is the only goal trending flat. Practice the reframe pattern on
              three calls this week.
            </p>
            <p className="flex gap-2">
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
              You need 12 more calls to hit 50 this month — 3 per day covers it.
            </p>
          </div>
        </Panel>
      </div>
    </>
  );
}
