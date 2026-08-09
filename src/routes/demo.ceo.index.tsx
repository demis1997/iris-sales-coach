import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { chartTooltip } from "@/components/iris/chart-bits";
import { Chip, Panel, PanelHeader } from "@/components/iris/primitives";
import { AIInsight, KPICard, PageHeader } from "@/components/product/ui";
import { demoService } from "@/lib/demo/demo-service";

export const Route = createFileRoute("/demo/ceo/")({
  component: CeoOverviewPage,
});

function CeoOverviewPage() {
  const { data: kpis, loading: l1 } = useDemoQuery(() => demoService.getKpis(), []);
  const { data: brief } = useDemoQuery(() => demoService.getExecutiveBrief(), []);
  const { data: teams } = useDemoQuery(() => demoService.getTeams(), []);
  const { data: funnel } = useDemoQuery(() => demoService.getFunnel(), []);
  const { data: losses } = useDemoQuery(() => demoService.getLossReasons(), []);
  const { data: opps } = useDemoQuery(() => demoService.getOpportunities(), []);
  const { data: managers } = useDemoQuery(() => demoService.getManagers(), []);
  const { data: roi } = useDemoQuery(() => demoService.getCoachingRoi(), []);
  const { data: scatter } = useDemoQuery(() => demoService.getScatterAgents(), []);
  const [lossId, setLossId] = useState("trust");

  const loss = useMemo(() => losses?.find((l) => l.id === lossId) ?? losses?.[0], [losses, lossId]);

  if (l1 || !kpis) return <DemoLoading />;

  return (
    <DemoPage>
      <PageHeader
        title="Good morning, Alex."
        subtitle="Here's what's happening across Apex Markets today."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          label="Total Deposits"
          value={`€${(kpis.totalDeposits / 1000).toFixed(1)}K`}
          delta={kpis.totalDepositsDelta}
        />
        <KPICard label="FTDs" value={`${kpis.ftds}`} delta={kpis.ftdsDelta} />
        <KPICard
          label="Conversion"
          value={`${kpis.conversionRate}%`}
          delta={kpis.conversionDeltaPts}
        />
        <KPICard
          label="Revenue at Risk"
          value={`€${(kpis.revenueAtRisk / 1000).toFixed(1)}K`}
          hint={kpis.revenueAtRiskTooltip}
        />
      </div>

      <AIInsight
        title="Artemis Executive Brief"
        subtitle="Simulated AI · Chief Revenue style summary"
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/demo/ceo/opportunities" className="product-btn-primary !px-4 !py-2 text-xs">
              View opportunities
            </Link>
            <Link to="/demo/ceo/teams" className="product-btn-secondary !px-4 !py-2 text-xs">
              View teams
            </Link>
          </div>
        }
      >
        <p className="whitespace-pre-line text-[15px] leading-relaxed text-[#C5D0E0]">{brief?.body}</p>
        <Link
          to="/demo/ceo/teams/$teamId"
          params={{ teamId: "team-velocity" }}
          className="mt-4 inline-flex text-[13px] font-semibold text-[#2EE6A6] hover:underline"
        >
          Open Velocity Desk →
        </Link>
      </AIInsight>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Revenue by team" subtitle="Deposits · click a desk" />
          <div className="h-56 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teams ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#8A9BB5" }} />
                <YAxis tick={{ fontSize: 11, fill: "#8A9BB5" }} />
                <Tooltip {...chartTooltip} />
                <Bar dataKey="deposits" name="Deposits €" radius={[6, 6, 0, 0]}>
                  {(teams ?? []).map((t) => (
                    <Cell
                      key={t.id}
                      fill={t.id === "team-velocity" ? "#F5B942" : "#18C4FF"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="divide-y divide-border border-t border-border">
            {(teams ?? []).map((t) => (
              <Link
                key={t.id}
                to="/demo/ceo/teams/$teamId"
                params={{ teamId: t.id }}
                className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 text-sm hover:bg-secondary/40"
              >
                <span className="font-medium">{t.name}</span>
                <span className="text-xs text-muted-foreground">
                  €{(t.deposits / 1000).toFixed(0)}K · {t.ftds} FTDs · {t.conversion}% · AI {t.avgQuality}
                </span>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Conversion funnel" subtitle="Biggest drop highlighted" />
          <div className="space-y-2 p-5">
            {(funnel ?? []).map((s, i, arr) => {
              const next = arr[i + 1];
              const drop = next ? s.value - next.value : 0;
              const worst = i === 2; // qualified → high intent story beat
              return (
                <div key={s.stage}>
                  <div
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${
                      worst ? "border border-warning/40 bg-warning/10" : "bg-secondary/30"
                    }`}
                  >
                    <span>{s.stage}</span>
                    <span className="font-mono">{s.value.toLocaleString()}</span>
                  </div>
                  {next ? (
                    <p className={`py-1 text-center text-[10px] ${worst ? "text-warning" : "text-muted-foreground"}`}>
                      ↓ {drop.toLocaleString()}
                      {worst ? " · Biggest opportunity: qualified → high intent" : ""}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Why deals are lost" subtitle="Click a reason · Demo Analysis" />
          <div className="space-y-2 p-5">
            {(losses ?? []).map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLossId(l.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left text-sm ${
                  lossId === l.id ? "bg-primary/15" : "hover:bg-secondary/40"
                }`}
              >
                <span className="w-40 shrink-0 text-xs">{l.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full gradient-surface" style={{ width: `${l.pct}%` }} />
                </div>
                <span className="w-10 text-right font-mono text-xs">{l.pct}%</span>
              </button>
            ))}
          </div>
          {loss ? (
            <div className="border-t border-border px-5 py-4 text-sm">
              <p className="font-medium">{loss.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {loss.calls} calls · €{(loss.value / 1000).toFixed(0)}K estimated opportunity value
              </p>
              <p className="mt-2 text-xs">
                Agents struggling most: Daniel Petrou, Chris Nicolaou.{" "}
                <Link
                  to="/demo/calls/$callId"
                  params={{ callId: "call-daniel-lost" }}
                  className="text-primary hover:underline"
                >
                  Open example call
                </Link>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Recommended action: coach trust/withdrawal handling before deposit asks.
              </p>
            </div>
          ) : null}
        </Panel>

        <Panel>
          <PanelHeader
            title="High-intent opportunities"
            subtitle="Money left on the table"
            action={
              <Link to="/demo/ceo/opportunities" className="text-xs text-primary hover:underline">
                View all
              </Link>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-[11px] text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-2">Client</th>
                  <th className="px-2 py-2">Agent</th>
                  <th className="px-2 py-2">Intent</th>
                  <th className="px-2 py-2">Value</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(opps ?? []).slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-2.5">
                      <Link to="/demo/calls/$callId" params={{ callId: o.callId }} className="text-primary hover:underline">
                        {o.contactLabel}
                      </Link>
                      <p className="text-[10px] text-muted-foreground">{o.lastCallAgo}</p>
                    </td>
                    <td className="px-2 py-2.5 text-xs">{o.agentName}</td>
                    <td className="px-2 py-2.5">
                      <Chip tone={o.intent === "very_high" ? "good" : "iris"}>{o.intent.replace("_", " ")}</Chip>
                    </td>
                    <td className="px-2 py-2.5 font-mono text-xs">€{o.estimatedValue.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{o.nextAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel>
          <PanelHeader title="Manager effectiveness" subtitle="Coaching completion vs conversion move" />
          <div className="divide-y divide-border">
            {(managers ?? []).map((m) => (
              <div key={m.id} className="px-5 py-3">
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.teamName}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <Chip tone={m.teamConversionDelta >= 0 ? "good" : "bad"}>
                    Team conversion {m.teamConversionDelta >= 0 ? "+" : ""}
                    {m.teamConversionDelta}%
                  </Chip>
                  <Chip tone="neutral">Coaching completion {m.coachingCompletion}%</Chip>
                </div>
              </div>
            ))}
          </div>
          <p className="border-t border-border px-5 py-3 text-[11px] text-muted-foreground">
            Teams completing more assigned coaching have shown stronger conversion improvement during this demo
            period. Not a causal claim.
          </p>
        </Panel>

        <Panel>
          <PanelHeader title="Coaching ROI" subtitle={roi?.label} />
          <div className="space-y-4 p-5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Before coaching</span>
              <span className="font-mono">{roi?.before}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">After coaching</span>
              <span className="font-mono">{roi?.after}%</span>
            </div>
            <p className="text-2xl font-semibold text-primary">+{roi?.deltaPts} pts</p>
            <p className="text-xs text-muted-foreground">Demo cohort comparison</p>
            <Link to="/demo/manager/coaching" className="text-xs text-primary hover:underline">
              Open manager coaching →
            </Link>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Rep performance matrix" subtitle="Quality × conversion · bubble = deposits" />
          <div className="h-56 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" dataKey="quality" name="Quality" domain={[55, 100]} tick={{ fontSize: 10 }} />
                <YAxis type="number" dataKey="conversion" name="Conversion" domain={[0, 30]} tick={{ fontSize: 10 }} />
                <ZAxis type="number" dataKey="deposits" range={[40, 200]} />
                <Tooltip {...chartTooltip} cursor={{ strokeDasharray: "3 3" }} />
                <Scatter
                  data={scatter ?? []}
                  fill="#18C4FF"
                  onClick={(d) => {
                    const payload = d as unknown as { id?: string };
                    if (payload.id) {
                      window.location.assign(`/demo/ceo/agents/${payload.id}`);
                    }
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="px-4 pb-3 text-[11px] text-muted-foreground">Click a bubble to open an agent profile.</p>
        </Panel>
      </div>
    </DemoPage>
  );
}
