import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeading, Panel, PanelHeader, Chip, Meter } from "@/components/iris/primitives";
import { dealIntelligence } from "@/lib/revenue-intelligence-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/crm/deal-risk")({
  head: () => ({
    meta: [
      { title: "Deal Risk — Artemis CRM" },
      { name: "description", content: "Win probability, risk factors, and next-best actions linked to conversations." },
    ],
  }),
  component: DealRiskPage,
});

function DealRiskPage() {
  const [selected, setSelected] = useState(dealIntelligence[0]?.id);
  const deal = dealIntelligence.find((d) => d.id === selected) ?? dealIntelligence[0];
  const [done, setDone] = useState<Record<string, boolean>>({});

  return (
    <>
      <PageHeading
        title="Deal risk & win probability"
        subtitle="Conversation signals → forecast category → recommended intervention"
      />

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Panel className="divide-y divide-border overflow-hidden">
          {dealIntelligence.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelected(d.id)}
              className={cn(
                "w-full px-4 py-3 text-left transition-colors hover:bg-secondary/40",
                selected === d.id && "bg-secondary/50",
              )}
            >
              <p className="text-sm font-medium leading-snug">{d.name}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-mono text-xs">{d.winProbability}%</span>
                <Chip tone={d.risk === "High" ? "bad" : d.risk === "Medium" ? "warn" : "good"}>
                  {d.risk}
                </Chip>
              </div>
            </button>
          ))}
        </Panel>

        <div className="space-y-4">
          <Panel className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{deal.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {deal.owner} · {deal.stage} · {deal.campaign} · €{(deal.value / 1000).toFixed(0)}k
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Win probability</p>
                <p className="font-mono text-4xl font-semibold gradient-text">{deal.winProbability}%</p>
                <p className="text-xs text-muted-foreground">
                  was {deal.previousWin}% · forecast {deal.forecast} · confidence {deal.confidence}%
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-5">
              {(Object.entries(deal.risks) as [string, number][]).map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border bg-secondary/30 p-3">
                  <p className="text-[10px] tracking-wide text-muted-foreground uppercase">{k}</p>
                  <p className="mt-1 font-mono text-lg">{v}</p>
                  <Meter value={v} />
                </div>
              ))}
            </div>
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel className="p-5">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Why the score changed
              </p>
              <div className="mt-3 space-y-3">
                {deal.timeline.map((t) => (
                  <div key={t.when + t.reason} className="flex gap-3 text-sm">
                    <span className="font-mono text-xs text-muted-foreground">{t.when}</span>
                    <div>
                      <p className="font-mono text-xs">{t.win}%</p>
                      <p className="text-xs text-muted-foreground">{t.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-2 text-xs">
                <p>
                  <span className="font-medium text-success">Positive: </span>
                  {deal.positive.join(" · ")}
                </p>
                <p>
                  <span className="font-medium text-destructive">Negative: </span>
                  {deal.negative.join(" · ")}
                </p>
                <p>
                  <span className="font-medium">Missing: </span>
                  {deal.missing.join(" · ")}
                </p>
              </div>
            </Panel>

            <Panel className="p-5">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Next best actions
              </p>
              <div className="mt-3 space-y-3">
                {deal.nextBestActions.map((a) => (
                  <div key={a.id} className="rounded-xl border border-border bg-secondary/30 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{a.action}</p>
                      <Chip tone={done[a.id] ? "good" : "warn"}>{done[a.id] ? "Done" : a.status}</Chip>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{a.rationale}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">Due {a.due}</p>
                    <button
                      type="button"
                      onClick={() => setDone((d) => ({ ...d, [a.id]: true }))}
                      className="mt-2 text-xs text-primary hover:underline"
                    >
                      Mark completed
                    </button>
                  </div>
                ))}
              </div>
              <Link to="/crm/pipeline" className="mt-4 inline-flex text-xs text-primary hover:underline">
                Back to pipeline →
              </Link>
            </Panel>
          </div>

          <Panel className="p-5">
            <PanelHeader title="Outcome CRM" subtitle="Auto-generated from conversations — review & approve" />
            <div className="grid gap-3 p-1 sm:grid-cols-2 text-sm">
              <Field label="AI summary" value={deal.outcomeCrm.summary} />
              <Field label="Buying intent" value={`${deal.outcomeCrm.buyingIntent}%`} />
              <Field label="Budget signals" value={deal.outcomeCrm.budget} />
              <Field label="Authority" value={deal.outcomeCrm.authority} />
              <Field label="Timeline" value={deal.outcomeCrm.timeline} />
              <Field label="Competitors" value={deal.outcomeCrm.competitors.join(", ") || "—"} />
              <Field label="Objections" value={deal.outcomeCrm.objections.join(", ") || "—"} />
              <Field label="Probability why" value={deal.outcomeCrm.probabilityWhy} />
              <Field label="Suggested follow-up" value={deal.outcomeCrm.suggestedFollowUp} />
              <Field label="Suggested email" value={deal.outcomeCrm.suggestedEmail} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 px-1 pb-2">
              {["Approve CRM update", "Update deal stage", "Create task", "Send email", "Escalate"].map((b) => (
                <button
                  key={b}
                  type="button"
                  className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-secondary"
                >
                  {b}
                </button>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/20 p-3">
      <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 text-xs leading-relaxed">{value}</p>
    </div>
  );
}
