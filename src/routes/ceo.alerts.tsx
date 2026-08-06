import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ShieldAlert, Clock, Sparkles } from "lucide-react";
import { PageHeading, Panel, PanelHeader, Chip } from "@/components/iris/primitives";
import { alerts } from "@/lib/iris-data";

export const Route = createFileRoute("/ceo/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts — Artemis Executive" },
      { name: "description", content: "Struggling reps, compliance risks and recognition-worthy performance." },
      { property: "og:title", content: "Alerts — Artemis Executive" },
      { property: "og:description", content: "Struggling reps, compliance risks and standout performance." },
    ],
  }),
  component: AlertsPage,
});

const meta = {
  risk: { icon: AlertTriangle, tone: "bad" as const, label: "At risk" },
  compliance: { icon: ShieldAlert, tone: "warn" as const, label: "Compliance" },
  idle: { icon: Clock, tone: "neutral" as const, label: "Idle" },
  praise: { icon: Sparkles, tone: "good" as const, label: "Recognition" },
};

function AlertsPage() {
  return (
    <>
      <PageHeading title="Alerts" subtitle="4 items need your attention today" />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Struggling employees", "3"],
          ["Compliance risks", "2"],
          ["Low confidence flags", "5"],
          ["Idle over 4h", "1"],
        ].map(([k, v]) => (
          <Panel key={k} className="p-4">
            <p className="text-xs text-muted-foreground">{k}</p>
            <p className="mt-2 font-mono text-2xl font-semibold">{v}</p>
          </Panel>
        ))}
      </div>

      <Panel className="mt-4">
        <PanelHeader title="Active alerts" subtitle="Sorted by urgency" />
        <div className="divide-y divide-border">
          {alerts.map((a) => {
            const m = meta[a.type];
            return (
              <div key={a.title} className="flex items-start gap-3 px-5 py-4">
                <m.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.detail}</p>
                </div>
                <Chip tone={m.tone}>{m.label}</Chip>
                <button className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary">
                  Review
                </button>
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
}
