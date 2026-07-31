import { Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { useSession } from "@/components/app/session";
import { formatEur, getVisibleCalls, getVisibleUsers, teamById } from "@/lib/demo/queries";
import { analysisByCallId } from "@/lib/demo/seed";
import { getSkillProfile, getTeamSkillHeatmap, listCoaching, SKILLS } from "@/lib/demo/operations";
import { can } from "@/lib/demo/rbac";
import { Chip } from "@/components/iris/primitives";
import { chartTooltip } from "@/components/iris/chart-bits";
import { cn } from "@/lib/utils";

export function TeamPage() {
  const { access } = useSession();
  if (!can(access.role, "team:read")) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <p className="font-medium">Team unavailable</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Switch to a manager or leadership role to view team intelligence.
        </p>
      </div>
    );
  }

  const reps = getVisibleUsers(access).filter(
    (u) => u.role === "representative" || u.role === "manager",
  );
  const calls = getVisibleCalls(access);
  const coaching = listCoaching(access.organisationId);

  const rows = reps
    .map((u) => {
      const mine = calls.filter(
        (c) => c.representativeId === u.id && c.analysisStatus === "Analyzed",
      );
      const scores = mine.map((c) => analysisByCallId[c.id]?.overallScore ?? 0);
      const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const profile = getSkillProfile(access.organisationId, u.id);
      const closed = mine.filter((c) => c.outcome === "Closed").length;
      const conversion = mine.length ? Math.round((closed / mine.length) * 100) : 0;
      const improvement = profile.overallScore - profile.previousOverall;
      const coachDone = coaching.filter(
        (c) => c.userId === u.id && c.status === "completed",
      ).length;
      const coachTotal = coaching.filter(
        (c) => c.userId === u.id && c.status !== "dismissed",
      ).length;
      return {
        u,
        avg,
        calls: mine.length,
        team: teamById(u.teamId)?.name,
        conversion,
        improvement,
        discovery: profile.skills.Discovery,
        listening: profile.skills.Listening,
        objections: profile.skills["Objection handling"],
        coachRate: coachTotal ? Math.round((coachDone / coachTotal) * 100) : 100,
        profile,
      };
    })
    .sort((a, b) => b.avg - a.avg);

  const heat = getTeamSkillHeatmap(
    access.organisationId,
    rows.map((r) => r.u.id),
  );

  const conversionTrend = ["W1", "W2", "W3", "W4"].map((week, i) => ({
    week,
    rate: Math.round(
      rows.reduce((s, r) => s + (r.profile.trend[i]?.conversion ?? r.conversion), 0) /
        Math.max(1, rows.length),
    ),
  }));

  const qualityVolume = rows.map((r) => ({
    name: r.u.name.split(" ")[0],
    volume: r.calls,
    quality: r.avg,
  }));

  const highlights = {
    top: rows[0],
    improved: [...rows].sort((a, b) => b.improvement - a.improvement)[0],
    discovery: [...rows].sort((a, b) => b.discovery - a.discovery)[0],
    listener: [...rows].sort((a, b) => b.listening - a.listening)[0],
    objections: [...rows].sort((a, b) => b.objections - a.objections)[0],
    consistent:
      [...rows].sort((a, b) => a.improvement - b.improvement).find((r) => r.avg >= 80) ?? rows[0],
    attention: [...rows].filter((r) => r.avg < 75).sort((a, b) => a.avg - b.avg)[0],
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        Use these views to coach with context. Scores highlight where support helps — not to rank
        people punitively. Higher discovery and listening usually precede stronger conversion.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Highlight
          label="Top performer"
          name={highlights.top?.u.name}
          detail={`Avg score ${highlights.top?.avg} — strong overall execution`}
          to={highlights.top?.u.id}
        />
        <Highlight
          label="Most improved"
          name={highlights.improved?.u.name}
          detail={`+${highlights.improved?.improvement} pts vs prior period`}
          to={highlights.improved?.u.id}
        />
        <Highlight
          label="Strongest discovery"
          name={highlights.discovery?.u.name}
          detail={`Discovery ${highlights.discovery?.discovery}/100`}
          to={highlights.discovery?.u.id}
        />
        <Highlight
          label="Best listener"
          name={highlights.listener?.u.name}
          detail={`Listening ${highlights.listener?.listening}/100`}
          to={highlights.listener?.u.id}
        />
        <Highlight
          label="Strongest objection handling"
          name={highlights.objections?.u.name}
          detail={`Objections ${highlights.objections?.objections}/100`}
          to={highlights.objections?.u.id}
        />
        <Highlight
          label="Most consistent"
          name={highlights.consistent?.u.name}
          detail="Stable high scores — great peer example"
          to={highlights.consistent?.u.id}
        />
        <Highlight
          label="Needs attention"
          name={highlights.attention?.u.name ?? "None"}
          detail={
            highlights.attention
              ? `Avg ${highlights.attention.avg} — prioritise supportive coaching`
              : "No reps below the attention threshold"
          }
          to={highlights.attention?.u.id}
          tone="warn"
        />
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">Representative leaderboard</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Sorted by average analysed-call score. Open a profile for strengths and coaching context.
        </p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-secondary/40 text-xs text-muted-foreground">
              <tr>
                {[
                  "Representative",
                  "Team",
                  "Calls",
                  "Avg score",
                  "Δ",
                  "Conversion",
                  "Coaching done",
                ].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={r.u.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-3">
                    <Link
                      to="/app/team/$userId"
                      params={{ userId: r.u.id }}
                      className="font-medium hover:text-primary"
                    >
                      {idx + 1}. {r.u.name}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{r.team}</td>
                  <td className="px-3 py-3 font-mono tabular-nums">{r.calls}</td>
                  <td className="px-3 py-3 font-mono tabular-nums">{r.avg || "—"}</td>
                  <td
                    className={cn(
                      "px-3 py-3 font-mono tabular-nums",
                      r.improvement >= 0 ? "text-success" : "text-destructive",
                    )}
                  >
                    {r.improvement >= 0 ? "+" : ""}
                    {r.improvement}
                  </td>
                  <td className="px-3 py-3 font-mono tabular-nums">{r.conversion}%</td>
                  <td className="px-3 py-3 font-mono tabular-nums">{r.coachRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">Improvement leaderboard</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[...rows]
            .sort((a, b) => b.improvement - a.improvement)
            .map((r) => (
              <Link
                key={r.u.id}
                to="/app/team/$userId"
                params={{ userId: r.u.id }}
                className="rounded-xl border border-border bg-card p-4 hover:border-primary/40"
              >
                <p className="font-medium">{r.u.name}</p>
                <p className="mt-1 text-sm text-success">
                  +{r.improvement} pts · now {r.avg}
                </p>
              </Link>
            ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">Skill heatmap</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Derived from the same call analyses as Overview and Profiles.
        </p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead className="border-b border-border bg-secondary/40 text-muted-foreground">
              <tr>
                <th className="px-2 py-2">Rep</th>
                {SKILLS.map((s) => (
                  <th key={s} className="px-2 py-2 font-medium whitespace-nowrap">
                    {s.split(" ")[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heat.map((row) => (
                <tr key={row.userId} className="border-b border-border last:border-0">
                  <td className="px-2 py-2 font-medium">{row.name.split(" ")[0]}</td>
                  {SKILLS.map((s) => (
                    <td key={s} className="px-2 py-2">
                      <span
                        className={cn(
                          "inline-block rounded px-1.5 py-0.5 font-mono tabular-nums",
                          row.skills[s] >= 85
                            ? "bg-success/15 text-success"
                            : row.skills[s] < 70
                              ? "bg-warning/15 text-warning"
                              : "bg-secondary text-muted-foreground",
                        )}
                      >
                        {row.skills[s]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Conversion trend</h2>
          <p className="text-xs text-muted-foreground">
            Team average conversion from profile trends
          </p>
          <div className="mt-3 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip {...chartTooltip} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  name="Conversion %"
                  stroke="var(--primary)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Quality versus volume</h2>
          <p className="text-xs text-muted-foreground">
            Aim for high quality — volume alone is not the goal.
          </p>
          <div className="mt-3 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis type="number" dataKey="volume" name="Calls" tick={{ fontSize: 11 }} />
                <YAxis
                  type="number"
                  dataKey="quality"
                  name="Score"
                  domain={[50, 100]}
                  tick={{ fontSize: 11 }}
                />
                <ZAxis range={[60, 60]} />
                <Tooltip {...chartTooltip} />
                <Scatter data={qualityVolume} fill="var(--primary)" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold">Calls per representative</h2>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows.map((r) => ({ name: r.u.name.split(" ")[0], calls: r.calls }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip {...chartTooltip} />
                <Bar dataKey="calls" name="Calls" fill="var(--cyan)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function Highlight({
  label,
  name,
  detail,
  to,
  tone = "default",
}: {
  label: string;
  name?: string;
  detail: string;
  to?: string;
  tone?: "default" | "warn";
}) {
  const inner = (
    <div
      className={cn(
        "h-full rounded-xl border border-border bg-card p-4",
        tone === "warn" && "border-warning/30",
      )}
    >
      <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-2 font-semibold">{name ?? "—"}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
  if (!to) return inner;
  return (
    <Link to="/app/team/$userId" params={{ userId: to }}>
      {inner}
    </Link>
  );
}
