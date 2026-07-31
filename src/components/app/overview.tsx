import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  Clock,
  Gauge,
  PhoneCall,
  Sparkles,
  TrendingUp,
  HelpCircle,
} from "lucide-react";
import { useSession } from "@/components/app/session";
import {
  formatEur,
  getCoachingImpact,
  getOverviewKpis,
  getRecentInsights,
  getRepsNeedingAttention,
  getRevenueTrend,
  getRiskDistribution,
  getTeamPerformanceTrend,
  getTopBehaviours,
  getVisibleCoaching,
  teamById,
} from "@/lib/demo/queries";
import { chartTooltip } from "@/components/iris/chart-bits";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const KPI_HELP = {
  revenueInfluenced:
    "Sum of deal values for Closed outcomes on analysed calls in the current scope and date range.",
  pipelineAtRisk:
    "Sum of open deal values with High risk in your permitted pipeline scope (excludes Closed won / Lost).",
  teamScore: "Average overall AI score across analysed calls in scope.",
  callsAnalysed: "Count of calls with analysisStatus = Analyzed in scope and date range.",
  coachingHoursSaved:
    "Demo estimate: analysed calls × 0.35 hours (proxy for manager review time avoided).",
  forecastConfidence: "Average forecastConfidence across open deals in scope.",
} as const;

export function OverviewDashboard() {
  const { access, user, allowed } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [access.filters, access.role, access.user.id]);

  let kpis;
  try {
    kpis = getOverviewKpis(access);
  } catch {
    return (
      <EmptyState
        title="Overview unavailable"
        text="Your role cannot view overview metrics for this scope."
      />
    );
  }

  const trend = getRevenueTrend(access);
  const perf = getTeamPerformanceTrend(access);
  const risk = getRiskDistribution(access);
  const coachingImpact = getCoachingImpact(access);
  const attention = getRepsNeedingAttention(access);
  const insights = getRecentInsights(access);
  const tasks = getVisibleCoaching(access)
    .filter((c) => c.status !== "completed" && c.status !== "dismissed")
    .slice(0, 5);
  const behaviours = getTopBehaviours();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  if (kpis.callsAnalysed === 0 && kpis.meta.callCount === 0) {
    return (
      <EmptyState
        title="No calls in this range"
        text="Adjust the date range or team filter to see overview metrics."
      />
    );
  }

  const cards = [
    {
      key: "revenueInfluenced" as const,
      label: "Revenue influenced",
      value: formatEur(kpis.revenueInfluenced),
      delta: kpis.deltas.revenueInfluenced,
      icon: TrendingUp,
    },
    {
      key: "pipelineAtRisk" as const,
      label: "Pipeline at risk",
      value: formatEur(kpis.pipelineAtRisk),
      delta: kpis.deltas.pipelineAtRisk,
      icon: AlertTriangle,
    },
    {
      key: "teamScore" as const,
      label: "Team performance score",
      value: `${kpis.teamScore}/100`,
      delta: kpis.deltas.teamScore,
      icon: Gauge,
    },
    {
      key: "callsAnalysed" as const,
      label: "Calls analysed",
      value: String(kpis.callsAnalysed),
      delta: kpis.deltas.callsAnalysed,
      icon: PhoneCall,
    },
    {
      key: "coachingHoursSaved" as const,
      label: "Coaching hours saved",
      value: String(kpis.coachingHoursSaved),
      delta: kpis.deltas.coachingHoursSaved,
      icon: Clock,
    },
    {
      key: "forecastConfidence" as const,
      label: "Forecast confidence",
      value: `${kpis.forecastConfidence}%`,
      delta: kpis.deltas.forecastConfidence,
      icon: Sparkles,
    },
  ];

  return (
    <TooltipProvider>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {allowed("overview:org")
            ? "Organisation performance"
            : allowed("overview:team")
              ? `${teamById(user.teamId)?.name ?? "Team"} performance`
              : `Personal performance · ${user.name}`}
          {" · "}
          compared to prior period (demo deltas)
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <div key={c.key} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {c.label}
                </p>
                <UiTooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-muted-foreground"
                      aria-label={`About ${c.label}`}
                    >
                      <HelpCircle className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">{KPI_HELP[c.key]}</TooltipContent>
                </UiTooltip>
              </div>
              <c.icon className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-3 font-mono text-2xl font-semibold tabular-nums">{c.value}</p>
            <p className={cn("mt-1 text-xs", c.delta >= 0 ? "text-success" : "text-destructive")}>
              {c.delta >= 0 ? "+" : ""}
              {c.delta}% vs prior period
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Revenue and pipeline trend"
          subtitle="Closed revenue vs high-risk pipeline touchpoints"
        >
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip {...chartTooltip} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.15}
              />
              <Area
                type="monotone"
                dataKey="pipeline"
                name="At-risk touch"
                stroke="var(--warning)"
                fill="var(--warning)"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Team performance trend" subtitle="Average call score by day">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={perf}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
              <Tooltip {...chartTooltip} />
              <Line
                type="monotone"
                dataKey="score"
                name="Score"
                stroke="var(--cyan)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Deal-risk distribution" subtitle="Open deals by risk level">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={risk} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>
                {risk.map((r) => (
                  <Cell
                    key={r.name}
                    fill={
                      r.name === "High"
                        ? "oklch(0.62 0.2 22)"
                        : r.name === "Medium"
                          ? "oklch(0.8 0.13 80)"
                          : "oklch(0.74 0.14 160)"
                    }
                  />
                ))}
              </Pie>
              <Tooltip {...chartTooltip} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-4 text-xs text-muted-foreground">
            {risk.map((r) => (
              <span key={r.name}>
                {r.name}: {r.value}
              </span>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="Coaching impact"
          subtitle="Demo cohort scores before vs after coaching weeks"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={coachingImpact}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip {...chartTooltip} />
              <Bar dataKey="before" name="Before" fill="oklch(0.45 0.02 250)" radius={4} />
              <Bar dataKey="after" name="After" fill="var(--primary)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <ListCard title="Top-performing behaviours">
          <ul className="space-y-3">
            {behaviours.map((b) => (
              <li key={b.behaviour} className="text-sm">
                <p className="font-medium">{b.behaviour}</p>
                <p className="text-xs text-muted-foreground">{b.lift}</p>
              </li>
            ))}
          </ul>
        </ListCard>

        <ListCard title="Representatives requiring attention">
          {attention.length === 0 ? (
            <p className="text-sm text-muted-foreground">No attention queue for your role/scope.</p>
          ) : (
            <ul className="space-y-3">
              {attention.map((r) => (
                <li key={r.user.id} className="flex items-center justify-between text-sm">
                  <span>{r.user.name}</span>
                  <span className="font-mono text-destructive tabular-nums">{r.avg}</span>
                </li>
              ))}
            </ul>
          )}
        </ListCard>

        <ListCard title="Recent Iris insights">
          <ul className="space-y-3">
            {insights.map((i) => (
              <li key={i.id} className="text-sm">
                <p className="font-medium">{i.title}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{i.body}</p>
              </li>
            ))}
          </ul>
        </ListCard>

        <ListCard title="Upcoming coaching tasks">
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No open coaching tasks.</p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((t) => (
                <li key={t.id} className="text-sm">
                  <Link to="/app/coaching" className="font-medium hover:text-primary">
                    {t.skill}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Due {t.dueDate} · {t.impactEstimate} impact
                  </p>
                </li>
              ))}
            </ul>
          )}
        </ListCard>
      </div>
    </TooltipProvider>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ListCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
