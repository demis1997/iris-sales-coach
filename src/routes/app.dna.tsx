import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
import { Dna, Sparkles, Trophy } from "lucide-react";
import { PageHeading, Panel, PanelHeader, Meter, Chip } from "@/components/iris/primitives";
import { chartTooltip } from "@/components/iris/chart-bits";
import { agentDnaProfiles, coachingPlans, topRepDna } from "@/lib/revenue-intelligence-data";
import { teamDna } from "@/lib/revenue-os-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/dna")({
  head: () => ({
    meta: [
      { title: "Revenue DNA — Artemis AI" },
      {
        name: "description",
        content:
          "Continuously evolving selling-skill profile from calls, roleplays, QA, CRM outcomes and closed revenue.",
      },
      { property: "og:title", content: "Revenue DNA — Artemis AI" },
    ],
  }),
  component: DnaPage,
});

const TABS = [
  "Overview",
  "Skill breakdown",
  "Call evidence",
  "Coaching plan",
  "Roleplay history",
  "Certifications",
  "Revenue impact",
  "Progress timeline",
] as const;

const gradeTone: Record<string, "good" | "warn" | "bad" | "iris"> = {
  Elite: "good",
  Strong: "iris",
  Developing: "warn",
  "Needs work": "bad",
};

function DnaPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [agentId, setAgentId] = useState("e-01");
  const profile = agentDnaProfiles.find((p) => p.agentId === agentId) ?? agentDnaProfiles[0];
  const radar = useMemo(
    () => profile.skills.slice(0, 8).map((s) => ({ trait: s.key, value: s.score, team: s.teamAvg })),
    [profile],
  );
  const plan = coachingPlans.find((p) => p.agentId === profile.agentId && p.status === "Active");
  const impactTotal = profile.skills.reduce((a, s) => a + s.revenueImpactEur, 0);

  return (
    <>
      <PageHeading
        title="Revenue DNA"
        subtitle="How you sell — profiled from live calls, roleplays, QA, CRM outcomes and closed revenue"
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Compare reps (manager view)</span>
        {agentDnaProfiles.map((p) => (
          <button
            key={p.agentId}
            type="button"
            onClick={() => setAgentId(p.agentId)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              agentId === p.agentId
                ? "border-primary/40 bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {p.name.split(" ")[0]}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl border border-border bg-secondary/20 p-1">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs whitespace-nowrap transition-colors",
              tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" || tab === "Skill breakdown" ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel className="gradient-border p-6 lg:col-span-1">
            <div className="flex items-center gap-2">
              <Dna className="size-4 text-primary" />
              <p className="text-xs tracking-wider text-muted-foreground uppercase">Profile</p>
            </div>
            <p className="mt-2 text-lg font-semibold">{profile.name}</p>
            <p className="text-xs text-muted-foreground">{profile.team}</p>
            <p className="mt-4 text-sm text-muted-foreground">Closing style</p>
            <p className="mt-1 text-3xl font-semibold gradient-text">{profile.closingStyle}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{profile.styleNote}</p>
            <div className="mt-5 rounded-xl border border-border bg-secondary/30 p-4">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Trophy className="size-3.5 text-warning" /> Predicted revenue potential
              </p>
              <p className="mt-1 font-mono text-2xl font-semibold">
                €{(profile.predictedPotential / 1000).toFixed(0)}k
              </p>
              <p className="mt-1 text-xs text-success">{profile.percentile}</p>
            </div>
          </Panel>

          <Panel className="lg:col-span-2">
            <PanelHeader
              title="DNA fingerprint"
              subtitle={`${profile.skills.length} skills · vs team average`}
            />
            <div className="h-80 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radar} outerRadius="74%">
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="trait" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                  <Tooltip {...chartTooltip} />
                  <Radar dataKey="team" stroke="var(--muted-foreground)" fill="var(--muted)" fillOpacity={0.12} />
                  <Radar dataKey="value" stroke="var(--violet)" fill="var(--violet)" fillOpacity={0.28} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      ) : null}

      {tab === "Skill breakdown" || tab === "Call evidence" || tab === "Overview" ? (
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {profile.skills.map((s) => (
            <Panel key={s.key} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{s.key}</p>
                  <p className="mt-1 font-mono text-2xl font-semibold">
                    {s.score}
                    <span className="text-sm text-muted-foreground">/100</span>
                  </p>
                </div>
                <Chip tone={gradeTone[s.grade]}>{s.grade}</Chip>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
                <div>
                  Prev <span className="font-mono text-foreground">{s.previous}</span>
                </div>
                <div>
                  Team <span className="font-mono text-foreground">{s.teamAvg}</span>
                </div>
                <div>
                  Top <span className="font-mono text-foreground">{s.topBenchmark}</span>
                </div>
              </div>
              <div className="mt-2">
                <Meter value={s.score} />
              </div>
              {(tab === "Skill breakdown" || tab === "Call evidence") && (
                <>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{s.explanation}</p>
                  <p className="mt-2 text-xs">
                    <span className="font-medium">Recommended: </span>
                    {s.exercise}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                    <Link
                      to="/app/calls/$callId"
                      params={{ callId: s.evidenceCallId }}
                      className="text-primary hover:underline"
                    >
                      Evidence {s.evidenceCallId}
                    </Link>
                    <span className="text-muted-foreground">{s.evidenceNote}</span>
                    {s.revenueImpactEur > 0 ? (
                      <Chip tone="warn">€{(s.revenueImpactEur / 1000).toFixed(0)}k impact if improved</Chip>
                    ) : null}
                  </div>
                  <div className="mt-3 h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={s.trend.map((v, i) => ({ w: `W${i + 1}`, v }))}>
                        <XAxis dataKey="w" hide />
                        <YAxis domain={[0, 100]} hide />
                        <Tooltip {...chartTooltip} />
                        <Line type="monotone" dataKey="v" stroke="var(--violet)" dot={false} strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </Panel>
          ))}
        </div>
      ) : null}

      {tab === "Coaching plan" ? (
        <Panel className="p-6">
          {plan ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <h3 className="text-lg font-semibold">{plan.focus}</h3>
                <Chip tone="iris">{plan.status}</Chip>
                <Chip tone="good">{plan.completion}% complete</Chip>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <PlanCell title="Daily" body={plan.daily} />
                <PlanCell title="Weekly" body={plan.weekly} />
                <PlanCell title="Monthly" body={plan.monthly} />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Before {plan.beforeScore} → After {plan.afterScore} · {plan.businessOutcome}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Manager: {plan.managerAction}</p>
              <Link to="/app/coach" className="mt-4 inline-flex text-sm text-primary hover:underline">
                Open full coaching workspace →
              </Link>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No active plan — assign from Manager → Coaching.</p>
          )}
        </Panel>
      ) : null}

      {tab === "Roleplay history" ? (
        <Panel className="divide-y divide-border overflow-hidden">
          {["Price objection · 88", "Competitor comparison · 74", "Cold prospect · 71"].map((row) => (
            <div key={row} className="flex items-center justify-between px-5 py-4 text-sm">
              <span>{row.split(" · ")[0]}</span>
              <div className="flex items-center gap-3">
                <span className="font-mono">{row.split(" · ")[1]}</span>
                <Link to="/app/roleplay" className="text-xs text-primary hover:underline">
                  Retry
                </Link>
              </div>
            </div>
          ))}
        </Panel>
      ) : null}

      {tab === "Certifications" ? (
        <Panel className="p-5">
          <p className="text-sm text-muted-foreground">Held certifications</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.certifications.length ? (
              profile.certifications.map((c) => (
                <Chip key={c} tone="good">
                  {c}
                </Chip>
              ))
            ) : (
              <Chip tone="bad">None — dialer campaigns may be locked</Chip>
            )}
          </div>
          <Link to="/app/certifications" className="mt-4 inline-flex text-sm text-primary hover:underline">
            Manage certifications & campaign access →
          </Link>
        </Panel>
      ) : null}

      {tab === "Revenue impact" ? (
        <Panel className="p-6">
          <p className="text-xs text-muted-foreground">Estimated uplift if skill gaps close</p>
          <p className="mt-2 font-mono text-4xl font-semibold gradient-text">
            €{(impactTotal / 1000).toFixed(0)}k
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Evidence-based correlation unless causality is statistically supported.
          </p>
          <div className="mt-6 rounded-xl border border-border bg-secondary/30 p-4">
            <p className="text-xs font-semibold">Top-Rep DNA patterns (behavioral — not identity)</p>
            <p className="mt-1 text-xs text-muted-foreground">Source: {topRepDna.sourceRep}</p>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {topRepDna.behaviors.map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>
          </div>
        </Panel>
      ) : null}

      {tab === "Progress timeline" ? (
        <Panel>
          <PanelHeader title="Skill trends" subtitle="Last 7 weeks" />
          <div className="h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={(profile.skills[0]?.trend ?? []).map((_, i) => {
                  const row: Record<string, string | number> = { w: `W${i + 1}` };
                  profile.skills.slice(0, 4).forEach((s) => {
                    row[s.key] = s.trend[i];
                  });
                  return row;
                })}
              >
                <XAxis dataKey="w" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <YAxis domain={[40, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <Tooltip {...chartTooltip} />
                {profile.skills.slice(0, 4).map((s, i) => (
                  <Line
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    stroke={["var(--violet)", "var(--cyan)", "var(--success)", "var(--warning)"][i]}
                    dot={false}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      ) : null}

      <Panel className="mt-4">
        <PanelHeader title="Team DNA comparison" subtitle="Managers compare profiles across the floor" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Rep</th>
                <th className="px-3 py-3 font-medium">Style</th>
                <th className="px-3 py-3 font-medium">Trust</th>
                <th className="px-3 py-3 font-medium">Price</th>
                <th className="px-3 py-3 font-medium">Close</th>
                <th className="px-5 py-3 font-medium">Potential</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {teamDna.map((r) => (
                <tr key={r.rep} className="hover:bg-secondary/30">
                  <td className="px-5 py-3 font-medium">{r.rep}</td>
                  <td className="px-3 py-3 text-muted-foreground">{r.style}</td>
                  <td className="px-3 py-3 font-mono">{r.trust}</td>
                  <td className="px-3 py-3 font-mono">{r.price}</td>
                  <td className="px-3 py-3 font-mono">{r.close}</td>
                  <td className="px-5 py-3">
                    <Chip tone={r.potential.includes("Top 5") ? "good" : r.potential.includes("Bottom") ? "bad" : "iris"}>
                      {r.potential}
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

function PlanCell({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4">
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{title}</p>
      <p className="mt-2 text-sm leading-relaxed">{body}</p>
    </div>
  );
}
