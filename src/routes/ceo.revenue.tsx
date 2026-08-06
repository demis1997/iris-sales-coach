import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeading, Panel, PanelHeader, Chip, StatCard } from "@/components/iris/primitives";
import {
  ceoRevenueIntel,
  coachingRevenueStory,
  dealIntelligence,
} from "@/lib/revenue-intelligence-data";

export const Route = createFileRoute("/ceo/revenue")({
  head: () => ({
    meta: [
      { title: "Revenue Intelligence — Iris Executive" },
      { name: "description", content: "Executive outcomes: forecast, coaching ROI, skill gaps, and drill-down." },
    ],
  }),
  component: CeoRevenuePage,
});

function CeoRevenuePage() {
  return (
    <>
      <PageHeading
        title="Revenue intelligence"
        subtitle="Business outcomes — not just call volume"
      />

      <Panel className="mb-4 gradient-border p-5">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          AI executive summary
        </p>
        <p className="mt-2 text-sm leading-relaxed">{ceoRevenueIntel.summary}</p>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ceoRevenueIntel.kpis.map((k) => (
          <StatCard key={k.label} label={k.label} value={k.value} delta={k.delta} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel>
          <PanelHeader title="Top objections causing lost deals" />
          <div className="divide-y divide-border">
            {ceoRevenueIntel.topObjections.map((o) => (
              <div key={o.name} className="flex items-center justify-between px-5 py-3 text-sm">
                <span>{o.name}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {o.lost} · €{(o.eur / 1000).toFixed(0)}k
                </span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-5">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Winning talk tracks
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {ceoRevenueIntel.winningTracks.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
        </Panel>
        <Panel className="p-5">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Coaching → revenue
          </p>
          <p className="mt-2 text-sm font-medium">{coachingRevenueStory.title}</p>
          <p className="mt-2 font-mono text-2xl">
            {coachingRevenueStory.before}→{coachingRevenueStory.after}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            +{coachingRevenueStory.conversionLift}% meetings · €
            {(coachingRevenueStory.revenueInfluenced / 1000).toFixed(0)}k influenced
          </p>
          <p className="mt-3 text-[10px] text-muted-foreground">{coachingRevenueStory.caveat}</p>
        </Panel>
      </div>

      <Panel className="mt-4">
        <PanelHeader
          title="Drill-down"
          subtitle="Company → Team → Rep → Campaign → Call → Deal"
        />
        <div className="grid gap-2 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {dealIntelligence.map((d) => (
            <Link
              key={d.id}
              to="/crm/deal-risk"
              className="rounded-xl border border-border p-4 transition-colors hover:border-primary/40"
            >
              <p className="text-sm font-medium">{d.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {d.owner} · {d.campaign}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-mono text-xs">{d.winProbability}%</span>
                <Chip tone={d.risk === "High" ? "bad" : "warn"}>{d.risk}</Chip>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 border-t border-border px-5 py-3 text-xs">
          <Link to="/ceo/employees" className="text-primary hover:underline">
            Employees →
          </Link>
          <Link to="/ceo/comparison" className="text-primary hover:underline">
            Team comparison →
          </Link>
          <Link to="/manager/qa" className="text-primary hover:underline">
            QA workspace →
          </Link>
        </div>
      </Panel>
    </>
  );
}
