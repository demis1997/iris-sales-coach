import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart as RLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  Clock,
  Gauge,
  PhoneCall,
  Percent,
  Sparkles,
  Target,
  TrendingUp,
  Waves,
} from "lucide-react";
import { PageHeading, Panel, PanelHeader, StatCard, Chip } from "@/components/iris/primitives";
import { calls, improvement } from "@/lib/iris-data";
import { chartTooltip } from "@/components/iris/chart-bits";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Iris Rep Workspace" },
      { name: "description", content: "Today's calls, scores, confidence and close rate." },
      { property: "og:title", content: "Dashboard — Iris Rep Workspace" },
      { property: "og:description", content: "Today's calls, scores, confidence and close rate." },
    ],
  }),
  component: RepDashboard,
});

const outcomeTone: Record<string, "good" | "warn" | "bad" | "neutral" | "iris"> = {
  Closed: "good",
  "Follow-up": "warn",
  Qualified: "iris",
  Lost: "bad",
  "No answer": "neutral",
};

function RepDashboard() {
  return (
    <>
      <PageHeading
        title="Good morning, Alex"
        subtitle="You're on a 6-day improvement streak. Confidence is up 5 points this week."
        action={
          <Link
            to="/app/coach"
            className="inline-flex items-center gap-2 rounded-xl gradient-surface px-4 py-2 text-sm font-medium text-background"
          >
            <Sparkles className="size-4" /> Open AI coach
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today's calls" value="14" delta={12} icon={PhoneCall} />
        <StatCard label="Average score" value="86" delta={4} icon={Gauge} />
        <StatCard label="Confidence" value="88%" delta={5} icon={Waves} />
        <StatCard label="Close rate" value="31%" delta={9} icon={Percent} />
        <StatCard label="Calls this week" value="63" delta={7} icon={PhoneCall} />
        <StatCard label="Talk time" value="9h 42m" hint="Avg 12:18 per call" icon={Clock} />
        <StatCard label="Conversion rate" value="24%" delta={3} icon={Target} />
        <StatCard label="Improvement" value="+17%" delta={17} icon={TrendingUp} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="Score & confidence trend" subtitle="Last 8 weeks" />
          <div className="h-64 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={improvement}>
                <defs>
                  <linearGradient id="g-score" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--violet)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--violet)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g-conf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--cyan)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" width={28} />
                <Tooltip {...chartTooltip} />
                <Area type="monotone" dataKey="score" stroke="var(--violet)" strokeWidth={2} fill="url(#g-score)" />
                <Area type="monotone" dataKey="confidence" stroke="var(--cyan)" strokeWidth={2} fill="url(#g-conf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Iris daily brief" subtitle="Generated 08:04" />
          <div className="space-y-3 p-5 text-sm">
            {[
              "Your talk ratio dropped to 55% — the best week you've had.",
              "Discovery is still your weakest stage (74). Two more questions per call closes the gap.",
              "You handle price objections 22% better in the morning. Book your hard calls before noon.",
            ].map((t) => (
              <p key={t} className="flex gap-2 text-muted-foreground">
                <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
                {t}
              </p>
            ))}
            <Link
              to="/app/performance"
              className="inline-flex items-center gap-1 pt-1 text-xs text-primary hover:underline"
            >
              See full performance <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </Panel>
      </div>

      <Panel className="mt-4 overflow-hidden">
        <PanelHeader
          title="Recent calls"
          subtitle="Click any call to open the full AI analysis"
          action={
            <Link to="/app/calls" className="text-xs text-primary hover:underline">
              View all
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] tracking-wider text-muted-foreground uppercase">
                {["Date", "Prospect", "Duration", "Outcome", "AI score", "Confidence", "Status", ""].map(
                  (h) => (
                    <th key={h} className="px-5 py-3 font-medium">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {calls.map((c) => (
                <tr key={c.id} className="border-b border-border/60 transition-colors hover:bg-secondary/30">
                  <td className="px-5 py-3 text-muted-foreground">
                    {c.date} · {c.time}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium">{c.prospect}</p>
                    <p className="text-xs text-muted-foreground">{c.company}</p>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs">{c.duration}</td>
                  <td className="px-5 py-3">
                    <Chip tone={outcomeTone[c.outcome]}>{c.outcome}</Chip>
                  </td>
                  <td className="px-5 py-3 font-mono">{c.score || "—"}</td>
                  <td className="px-5 py-3 font-mono">{c.confidence ? `${c.confidence}%` : "—"}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{c.status}</td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      to="/app/calls/$callId"
                      params={{ callId: c.id }}
                      className="text-xs text-primary hover:underline"
                    >
                      Open analysis
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel className="mt-4">
        <PanelHeader title="Talk ratio vs. close rate" subtitle="Less talking, more closing" />
        <div className="h-56 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <RLineChart data={improvement}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
              <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" width={28} />
              <Tooltip {...chartTooltip} />
              <Line type="monotone" dataKey="talkRatio" stroke="var(--warning)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="closeRate" stroke="var(--success)" strokeWidth={2} dot={false} />
            </RLineChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </>
  );
}
