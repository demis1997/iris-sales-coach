import { Link } from "@tanstack/react-router";
import {
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
import { useSession } from "@/components/app/session";
import { teamById, userById } from "@/lib/demo/queries";
import { analysisByCallId, calls } from "@/lib/demo/seed";
import {
  getSkillProfile,
  listCoaching,
  listTrainingAssignments,
  listTrainingModules,
  SKILLS,
} from "@/lib/demo/operations";
import type { SkillName } from "@/lib/demo/types";
import { can } from "@/lib/demo/rbac";
import { Chip, Meter, ScoreRing } from "@/components/iris/primitives";
import { chartTooltip } from "@/components/iris/chart-bits";
import { Button } from "@/components/ui/button";

export function RepProfilePage({ userId }: { userId: string }) {
  const { access } = useSession();
  const user = userById(userId);

  const allowed =
    user &&
    user.organisationId === access.organisationId &&
    (user.id === access.user.id ||
      can(access.role, "team:read") ||
      can(access.role, "overview:org"));

  if (!user || !allowed) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <p className="font-medium">Profile unavailable</p>
        <p className="mt-1 text-sm text-muted-foreground">
          You do not have permission to view this representative.
        </p>
        <Button className="mt-4" variant="outline" asChild>
          <Link to="/app/team">Back to team</Link>
        </Button>
      </div>
    );
  }

  const profile = getSkillProfile(access.organisationId, userId);
  const mine = calls.filter(
    (c) => c.organisationId === access.organisationId && c.representativeId === userId,
  );
  const analysed = mine.filter((c) => c.analysisStatus === "Analyzed");
  const best = [...analysed]
    .sort(
      (a, b) =>
        (analysisByCallId[b.id]?.overallScore ?? 0) - (analysisByCallId[a.id]?.overallScore ?? 0),
    )
    .slice(0, 3);
  const needsReview = analysed
    .filter((c) => !c.reviewed || (analysisByCallId[c.id]?.overallScore ?? 100) < 70)
    .slice(0, 4);
  const coaching = listCoaching(access.organisationId).filter((c) => c.userId === userId);
  const activePlan = coaching.filter((c) => !["completed", "dismissed"].includes(c.status));
  const assignments = listTrainingAssignments(access.organisationId).filter(
    (a) => a.userId === userId,
  );
  const modules = listTrainingModules(access.organisationId);
  const radar = SKILLS.map((s) => ({ skill: s, value: profile.skills[s] }));

  return (
    <div>
      <Link to="/app/team" className="text-xs text-muted-foreground hover:text-foreground">
        ← Team
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user.title} · {teamById(user.teamId)?.name}
          </p>
        </div>
        <ScoreRing value={profile.overallScore} size={112} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Overall score"
          value={`${profile.overallScore}`}
          hint={`Was ${profile.previousOverall}`}
        />
        <Stat
          label="Calls analysed"
          value={`${analysed.length}`}
          hint={`${mine.length} total in seed`}
        />
        <Stat
          label="Conversion"
          value={`${profile.conversionRate}%`}
          hint={`Was ${profile.previousConversion}%`}
        />
        <Stat
          label="Active coaching"
          value={`${activePlan.length}`}
          hint={`${coaching.filter((c) => c.status === "completed").length} completed`}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Performance trend</h2>
          <div className="mt-3 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profile.trend}>
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} />
                <Tooltip {...chartTooltip} />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Score"
                  stroke="var(--primary)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="conversion"
                  name="Conversion"
                  stroke="var(--cyan)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Skill radar</h2>
          <div className="mt-3 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar}>
                <PolarGrid stroke="oklch(1 0 0 / 0.1)" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 9 }} />
                <Radar
                  dataKey="value"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Strengths</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {profile.strengths.map((s) => (
              <li key={s} className="flex justify-between">
                <span>{s}</span>
                <span className="font-mono tabular-nums">{profile.skills[s as SkillName]}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Improvement areas</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {profile.improvementAreas.map((s) => (
              <li key={s} className="flex justify-between">
                <span>{s}</span>
                <span className="font-mono tabular-nums text-foreground">
                  {profile.skills[s as SkillName]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Communication Style Insights</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          These insights describe observable communication patterns and are not psychological
          assessments.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Style
            label="Direct vs consultative"
            value={profile.communicationStyle.directVsConsultative}
          />
          <Style label="Concise vs detailed" value={profile.communicationStyle.conciseVsDetailed} />
          <Style
            label="Question vs presentation"
            value={profile.communicationStyle.questionVsPresentation}
          />
          <Style label="Energy" value={profile.communicationStyle.energy} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Active coaching plan</h2>
          <div className="mt-3 space-y-3">
            {activePlan.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active coaching items.</p>
            ) : (
              activePlan.map((c) => (
                <div key={c.id}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{c.skill}</span>
                    <Chip tone="iris">{c.status}</Chip>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{c.evidence}</p>
                  <Meter value={c.progress} />
                </div>
              ))
            )}
          </div>
          <Button className="mt-3" size="sm" variant="outline" asChild>
            <Link to="/app/coaching">Open coaching</Link>
          </Button>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Training progress</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {assignments.map((a) => {
              const mod = modules.find((m) => m.id === a.moduleId);
              return (
                <li key={a.id} className="flex justify-between gap-2">
                  <span>{mod?.title}</span>
                  <span className="text-muted-foreground">
                    {a.status}
                    {a.score != null ? ` · ${a.score}` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Best calls</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {best.map((c) => (
              <li key={c.id}>
                <Link
                  to="/app/calls/$callId"
                  params={{ callId: c.id }}
                  className="hover:text-primary"
                >
                  {c.prospect} · {analysisByCallId[c.id]?.overallScore}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Calls needing review</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {needsReview.map((c) => (
              <li key={c.id}>
                <Link
                  to="/app/calls/$callId"
                  params={{ callId: c.id }}
                  className="hover:text-primary"
                >
                  {c.prospect} · {analysisByCallId[c.id]?.overallScore ?? "—"}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Coaching timeline</h2>
        <ol className="mt-3 space-y-3 border-l border-border pl-4">
          {[...coaching]
            .sort((a, b) => b.dueDate.localeCompare(a.dueDate))
            .map((c) => (
              <li key={c.id} className="relative text-sm">
                <span className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-primary" />
                <p className="font-medium">{c.skill}</p>
                <p className="text-xs text-muted-foreground">
                  {c.status} · due {c.dueDate}
                  {c.completedAt ? ` · completed ${c.completedAt}` : ""}
                  {c.behaviourImproved === true ? " · behaviour improved" : ""}
                </p>
              </li>
            ))}
        </ol>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Recent feedback</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {activePlan.slice(0, 3).map((c) => (
            <li key={c.id}>
              <span className="text-foreground">{c.skill}: </span>
              {c.recommendation}
            </li>
          ))}
          {activePlan.length === 0 ? <li>No recent coaching feedback.</li> : null}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 font-mono text-xl font-semibold tabular-nums">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function Style({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/20 p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
