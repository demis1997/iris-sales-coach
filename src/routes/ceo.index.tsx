import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  BadgeDollarSign,
  Gauge,
  PhoneCall,
  Percent,
  Sparkles,
  TrendingUp,
  Users,
  Waves,
} from "lucide-react";
import { PageHeading, Panel, PanelHeader, StatCard, Chip } from "@/components/iris/primitives";
import { chartTooltip } from "@/components/iris/chart-bits";
import {
  callsPerDay,
  employees,
  executiveInsights,
  hourlyCloseRate,
  revenueTrend,
} from "@/lib/iris-data";
import { useAuth } from "@/components/auth/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { getCompanyDashboardMetrics } from "@/lib/calls";
import { listCompanyMembers } from "@/lib/company-members";

export const Route = createFileRoute("/ceo/")({
  head: () => ({
    meta: [
      { title: "Company Overview — Artemis Executive" },
      { name: "description", content: "Total calls, revenue, close rate and AI score across the company." },
      { property: "og:title", content: "Company Overview — Artemis Executive" },
      { property: "og:description", content: "Total calls, revenue, close rate and AI score." },
    ],
  }),
  component: CeoOverview,
});

function CeoOverview() {
  const { session, demoMode } = useAuth();
  const { data: live } = useQuery({
    queryKey: ["ceo-metrics", session?.activeCompanyId],
    queryFn: getCompanyDashboardMetrics,
    enabled: Boolean(session?.activeCompanyId) && !demoMode,
  });
  const { data: members = [] } = useQuery({
    queryKey: ["company-members", session?.activeCompanyId],
    queryFn: () => listCompanyMembers(),
    enabled: Boolean(session?.activeCompanyId) && !demoMode,
  });

  return (
    <>
      <PageHeading
        title="Revenue Command Center"
        subtitle={
          demoMode
            ? "Demo seed data · connect Supabase for live metrics"
            : `${session?.membership?.companyName ?? "Company"} · live calls + memberships`
        }
        action={<Chip tone="good">{demoMode ? "Demo" : "Live"}</Chip>}
      />

      {!demoMode ? (
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Active members" value={`${members.length}`} icon={Users} />
          <StatCard label="Calls (recent)" value={`${live?.callsCount ?? 0}`} icon={PhoneCall} />
          <StatCard
            label="Avg AI score"
            value={live?.avgScore != null ? `${live.avgScore}` : "—"}
            icon={Gauge}
          />
          <StatCard label="Conversions (recent)" value={`${live?.conversions ?? 0}`} icon={TrendingUp} />
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total employees" value={demoMode ? "48" : `${members.length || "—"}`} hint="from memberships" icon={Users} />
        <StatCard label="Calls today" value={demoMode ? "487" : `${live?.callsCount ?? 0}`} delta={demoMode ? 6 : undefined} icon={PhoneCall} />
        <StatCard label="Calls this month" value={demoMode ? "9,412" : `${live?.callsCount ?? 0}`} delta={demoMode ? 11 : undefined} icon={PhoneCall} />
        <StatCard label="Revenue generated" value="$1.67M" delta={18} icon={BadgeDollarSign} />
        <StatCard label="Close rate" value="27%" delta={4} icon={Percent} />
        <StatCard label="Average AI score" value="83" delta={5} icon={Gauge} />
        <StatCard label="Average confidence" value="78%" delta={6} icon={Waves} />
        <StatCard label="Team improvement" value="+8%" delta={8} icon={TrendingUp} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="Revenue & AI score" subtitle="Revenue in $K · last 6 months" />
          <div className="h-64 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueTrend}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--violet)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--violet)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" width={38} />
                <Tooltip {...chartTooltip} />
                <Area type="monotone" dataKey="revenue" stroke="var(--violet)" strokeWidth={2} fill="url(#rev)" />
                <Line type="monotone" dataKey="score" stroke="var(--cyan)" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="AI executive insights" subtitle="Daily summary" />
          <div className="space-y-3 p-5 text-sm">
            {executiveInsights.map((t) => (
              <p key={t} className="flex gap-2 text-muted-foreground">
                <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
                {t}
              </p>
            ))}
            <Link
              to="/ceo/insights"
              className="inline-flex items-center gap-1 pt-1 text-xs text-primary hover:underline"
            >
              Full briefing <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Calls per day" subtitle="Dialled vs. closed" />
          <div className="h-56 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={callsPerDay}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" width={32} />
                <Tooltip {...chartTooltip} />
                <Bar dataKey="calls" fill="var(--blue)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="closed" fill="var(--cyan)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Close rate by hour" subtitle="10–11 AM converts best" />
          <div className="h-56 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyCloseRate}>
                <defs>
                  <linearGradient id="hr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--success)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--success)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="hour" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" width={28} />
                <Tooltip {...chartTooltip} />
                <Area type="monotone" dataKey="rate" stroke="var(--success)" strokeWidth={2} fill="url(#hr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel className="mt-4 overflow-hidden">
        <PanelHeader
          title="Employees"
          subtitle="Click a name to open their full profile"
          action={
            <Link to="/ceo/employees" className="text-xs text-primary hover:underline">
              View all
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] tracking-wider text-muted-foreground uppercase">
                {["Name", "Department", "Calls", "Close %", "Confidence", "AI score", "Revenue", "Trend", "Risk"].map(
                  (h) => (
                    <th key={h} className="px-5 py-3 font-medium">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} className="border-b border-border/60 hover:bg-secondary/30">
                  <td className="px-5 py-3">
                    <Link
                      to="/ceo/employees/$employeeId"
                      params={{ employeeId: e.id }}
                      className="font-medium hover:text-primary"
                    >
                      {e.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{e.dept}</td>
                  <td className="px-5 py-3 font-mono">{e.calls}</td>
                  <td className="px-5 py-3 font-mono">{e.closeRate}%</td>
                  <td className="px-5 py-3 font-mono">{e.confidence}%</td>
                  <td className="px-5 py-3 font-mono">{e.score}</td>
                  <td className="px-5 py-3 font-mono">${(e.revenue / 1000).toFixed(0)}K</td>
                  <td className={`px-5 py-3 font-mono ${e.trend >= 0 ? "text-success" : "text-destructive"}`}>
                    {e.trend > 0 ? "+" : ""}
                    {e.trend}%
                  </td>
                  <td className="px-5 py-3">
                    <Chip tone={e.risk === "Low" ? "good" : e.risk === "Medium" ? "warn" : "bad"}>
                      {e.risk}
                    </Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
