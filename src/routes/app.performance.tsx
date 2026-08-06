import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeading, Panel, PanelHeader, StatCard } from "@/components/iris/primitives";
import { chartTooltip } from "@/components/iris/chart-bits";
import { improvement, personality, teamComparison } from "@/lib/iris-data";

export const Route = createFileRoute("/app/performance")({
  head: () => ({
    meta: [
      { title: "Performance — Iris Rep Workspace" },
      { name: "description", content: "Confidence, close rate and call quality trends over time." },
      { property: "og:title", content: "Performance — Iris Rep Workspace" },
      { property: "og:description", content: "Confidence, close rate and call quality trends." },
    ],
  }),
  component: PerformancePage,
});

function PerformancePage() {
  return (
    <>
      <PageHeading title="Performance" subtitle="Eight weeks of measured improvement" />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Confidence" value="88%" delta={27} hint="from 61% in W18" />
        <StatCard label="Average score" value="90" delta={24} hint="from 66 in W18" />
        <StatCard label="Close rate" value="31%" delta={17} hint="from 14% in W18" />
        <StatCard label="Talk ratio" value="55%" delta={-24} hint="target: under 55%" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Confidence over time" />
          <div className="h-60 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={improvement}>
                <defs>
                  <linearGradient id="p-conf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--cyan)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" width={28} />
                <Tooltip {...chartTooltip} />
                <Area type="monotone" dataKey="confidence" stroke="var(--cyan)" strokeWidth={2} fill="url(#p-conf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Close rate" />
          <div className="h-60 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={improvement}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" width={28} />
                <Tooltip {...chartTooltip} />
                <Bar dataKey="closeRate" fill="var(--violet)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Average score & talk ratio" />
          <div className="h-60 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={improvement}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" width={28} />
                <Tooltip {...chartTooltip} />
                <Line type="monotone" dataKey="score" stroke="var(--blue)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="talkRatio" stroke="var(--warning)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Skill profile" subtitle="You vs. desk average" />
          <div className="h-60 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={personality} outerRadius="72%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <Tooltip {...chartTooltip} />
                <Radar dataKey="value" stroke="var(--violet)" fill="var(--violet)" fillOpacity={0.28} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel className="mt-4">
        <PanelHeader title="Benchmark vs. team" subtitle="Normalized 0–100" />
        <div className="space-y-4 p-5">
          {teamComparison.map((t) => (
            <div key={t.metric}>
              <div className="mb-1.5 flex justify-between text-xs">
                <span>{t.metric}</span>
                <span className="font-mono text-muted-foreground">
                  you {t.alex} · team {t.team}
                </span>
              </div>
              <div className="relative h-1.5 w-full rounded-full bg-secondary">
                <div className="absolute h-1.5 rounded-full gradient-surface" style={{ width: `${t.alex}%` }} />
                <div
                  className="absolute -top-0.5 h-2.5 w-0.5 rounded bg-muted-foreground"
                  style={{ left: `${t.team}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
