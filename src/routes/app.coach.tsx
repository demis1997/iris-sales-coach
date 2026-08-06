import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Send } from "lucide-react";
import { PageHeading, Panel, PanelHeader, Meter, Chip } from "@/components/iris/primitives";
import { coachMessages, callStages } from "@/lib/iris-data";
import { coachingPlans, coachingRevenueStory } from "@/lib/revenue-intelligence-data";

export const Route = createFileRoute("/app/coach")({
  head: () => ({
    meta: [
      { title: "AI Coach — Iris Rep Workspace" },
      { name: "description", content: "Personal AI coaching plans tied to Revenue DNA and deal outcomes." },
      { property: "og:title", content: "AI Coach — Iris Rep Workspace" },
      { property: "og:description", content: "Personal AI coaching after every sales call." },
    ],
  }),
  component: CoachPage,
});

function CoachPage() {
  const myPlans = coachingPlans.filter((p) => p.agentId === "e-01");
  const active = myPlans.find((p) => p.status === "Active") ?? myPlans[0];

  return (
    <>
      <PageHeading
        title="Personal AI coaching plans"
        subtitle="Generated from Revenue DNA gaps, recent calls, lost deals, QA, roleplays and campaign requirements"
      />

      <div className="mb-4 grid gap-3 lg:grid-cols-3">
        {myPlans.map((p) => (
          <Panel key={p.id} className="p-4">
            <div className="flex items-center gap-2">
              <Chip tone={p.status === "Active" ? "good" : p.status === "Completed" ? "iris" : "neutral"}>
                {p.status}
              </Chip>
              <span className="text-xs text-muted-foreground">{p.completion}%</span>
            </div>
            <p className="mt-2 text-sm font-semibold">{p.focus}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {p.beforeScore}→{p.afterScore}
            </p>
            <Meter value={p.completion} />
          </Panel>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="flex flex-col lg:col-span-2">
          <PanelHeader title="Coaching session" subtitle="Iris · updated 2 minutes ago" />
          <div className="flex-1 space-y-4 p-5">
            {coachMessages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.from === "user" ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${
                    m.from === "iris"
                      ? "gradient-surface text-background"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {m.from === "iris" ? <Sparkles className="size-3.5" /> : "AM"}
                </span>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${
                    m.from === "iris"
                      ? "border border-border bg-secondary/30"
                      : "bg-primary/15 text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-border p-3">
            <input
              placeholder="Ask Iris about this call…"
              className="flex-1 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50"
            />
            <button className="grid size-9 place-items-center rounded-xl gradient-surface text-background">
              <Send className="size-4" />
            </button>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel className="gradient-border p-5">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">Coaching → revenue</p>
            <p className="mt-2 text-sm font-medium">{coachingRevenueStory.title}</p>
            <p className="mt-2 font-mono text-3xl font-semibold gradient-text">
              +{coachingRevenueStory.conversionLift}%
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              €{(coachingRevenueStory.revenueInfluenced / 1000).toFixed(0)}k influenced ·{" "}
              {coachingRevenueStory.agent}
            </p>
            <p className="mt-2 text-[10px] text-muted-foreground">{coachingRevenueStory.caveat}</p>
          </Panel>

          {active ? (
            <Panel>
              <PanelHeader title={active.focus} subtitle={`Criteria: ${active.criteria}`} />
              <div className="space-y-3 p-5 text-sm">
                <PlanLine label="Daily" text={active.daily} />
                <PlanLine label="Weekly" text={active.weekly} />
                <PlanLine label="Monthly" text={active.monthly} />
                <p className="text-xs text-muted-foreground">Manager: {active.managerAction}</p>
                <p className="text-xs">
                  Review calls:{" "}
                  {active.reviewCalls.map((id) => (
                    <Link
                      key={id}
                      to="/app/calls/$callId"
                      params={{ callId: id }}
                      className="mr-2 text-primary hover:underline"
                    >
                      {id}
                    </Link>
                  ))}
                </p>
                <Link to="/app/roleplay" className="text-xs text-primary hover:underline">
                  Required roleplays: {active.roleplays.join(", ") || "—"} →
                </Link>
                <Link to="/app/dna" className="block text-xs text-primary hover:underline">
                  Open Revenue DNA →
                </Link>
              </div>
            </Panel>
          ) : null}

          <Panel>
            <PanelHeader title="Stage scores" subtitle="Last call" />
            <div className="space-y-3 p-5">
              {callStages.map((s) => (
                <div key={s.stage}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">{s.stage}</span>
                    <span className="font-mono">{s.score}</span>
                  </div>
                  <Meter value={s.score} />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

function PlanLine({ label, text }: { label: string; text: string }) {
  return (
    <label className="flex items-start gap-2 text-muted-foreground">
      <input type="checkbox" className="mt-1 accent-[oklch(0.66_0.2_293)]" />
      <span>
        <span className="font-medium text-foreground">{label}: </span>
        {text}
      </span>
    </label>
  );
}
