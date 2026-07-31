import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, TrendingUp, AlertTriangle, Clock, Brain } from "lucide-react";
import { PageHeading, Panel, PanelHeader, Chip } from "@/components/iris/primitives";
import { executiveInsights } from "@/lib/iris-data";

export const Route = createFileRoute("/ceo/insights")({
  head: () => ({
    meta: [
      { title: "AI Insights — Iris Executive" },
      { name: "description", content: "Daily AI briefing on team performance, risks and revenue drivers." },
      { property: "og:title", content: "AI Insights — Iris Executive" },
      { property: "og:description", content: "Daily AI briefing on performance, risks and revenue." },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  return (
    <>
      <PageHeading
        title="AI executive insights"
        subtitle="Generated at 07:00 from 487 calls analyzed in the last 24 hours"
        action={<Chip tone="iris">Daily briefing</Chip>}
      />

      <Panel className="gradient-border p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Today's summary</h2>
        </div>
        <div className="mt-4 space-y-3">
          {executiveInsights.map((t) => (
            <p key={t} className="flex gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
              {t}
            </p>
          ))}
        </div>
      </Panel>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Panel>
          <PanelHeader title="Why deals are lost" subtitle="Last 30 days · 412 lost opportunities" />
          <div className="space-y-3 p-5">
            {[
              ["Pricing discussion", 61],
              ["No decision maker on call", 18],
              ["Weak discovery", 12],
              ["Timing / no budget", 9],
            ].map(([k, v]) => (
              <div key={k as string} className="flex items-center gap-3">
                <span className="w-44 text-xs text-muted-foreground">{k}</span>
                <div className="h-1.5 flex-1 rounded-full bg-secondary">
                  <div className="h-1.5 rounded-full gradient-surface" style={{ width: `${v}%` }} />
                </div>
                <span className="w-8 text-right font-mono text-xs">{v}%</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Recommended next actions" subtitle="Ranked by revenue impact" />
          <div className="divide-y divide-border">
            {[
              { icon: AlertTriangle, t: "Run a pricing objection workshop", d: "Est. impact +$180K/quarter" },
              { icon: Clock, t: "Shift 20% of dials to 10–11 AM", d: "Est. impact +$96K/quarter" },
              { icon: Brain, t: "Enforce MEDDIC qualification on the Real Estate desk", d: "Est. impact +$74K/quarter" },
              { icon: TrendingUp, t: "Pair Omar with Nadia for two weeks", d: "Est. impact +$41K/quarter" },
            ].map((a) => (
              <div key={a.t} className="flex items-start gap-3 px-5 py-3.5">
                <a.icon className="mt-0.5 size-4 shrink-0 text-cyan" />
                <div>
                  <p className="text-sm">{a.t}</p>
                  <p className="text-xs text-muted-foreground">{a.d}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Sentiment & emotion" subtitle="Detected across customer speech" />
          <div className="grid grid-cols-2 gap-3 p-5">
            {[
              ["Positive", "48%", "good"],
              ["Neutral", "31%", "neutral"],
              ["Skeptical", "15%", "warn"],
              ["Frustrated", "6%", "bad"],
            ].map(([k, v, tone]) => (
              <div key={k} className="rounded-xl border border-border bg-secondary/25 p-4">
                <Chip tone={tone as "good" | "neutral" | "warn" | "bad"}>{k}</Chip>
                <p className="mt-2 font-mono text-xl">{v}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Methodology scoring" subtitle="Company average adherence" />
          <div className="space-y-3 p-5">
            {[
              ["SPIN", 78],
              ["Challenger", 66],
              ["BANT", 84],
              ["MEDDIC", 71],
            ].map(([k, v]) => (
              <div key={k as string}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-mono">{v}</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary">
                  <div className="h-1.5 rounded-full gradient-surface" style={{ width: `${v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
