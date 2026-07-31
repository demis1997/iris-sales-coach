import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ArrowLeft, Check, Sparkles, X } from "lucide-react";
import { Panel, PanelHeader, ScoreRing, Meter, Chip } from "@/components/iris/primitives";
import { chartTooltip } from "@/components/iris/chart-bits";
import { calls, callStages, missingInfo, objections, personality } from "@/lib/iris-data";

export const Route = createFileRoute("/app/calls/$callId")({
  loader: ({ params }) => {
    const call = calls.find((c) => c.id === params.callId);
    if (!call) throw notFound();
    return { call };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Call unavailable — Iris" }, { name: "robots", content: "noindex" }] };
    }
    const t = `Call analysis: ${loaderData.call.prospect} — Iris`;
    return {
      meta: [
        { title: t },
        { name: "description", content: `AI breakdown of the call with ${loaderData.call.prospect} at ${loaderData.call.company}.` },
        { property: "og:title", content: t },
        { property: "og:description", content: "Stage scores, objection handling and coaching." },
      ],
    };
  },
  component: CallAnalysis,
});

function CallAnalysis() {
  const { call } = Route.useLoaderData();

  return (
    <>
      <Link
        to="/app/calls"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to calls
      </Link>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{call.prospect}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {call.company} · {call.date} at {call.time} · {call.duration} · Outbound
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip tone="iris">MEDDIC scored</Chip>
          <Chip tone="good">Compliance passed</Chip>
          <Chip tone="warn">Pitched early</Chip>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="flex flex-col items-center justify-center gap-3 p-6">
          <ScoreRing value={call.score || 0} />
          <p className="text-xs text-muted-foreground">Overall AI score</p>
          <div className="grid w-full grid-cols-2 gap-3 pt-3 text-xs">
            {[
              ["Talk ratio", `${call.talkRatio}%`],
              ["Interruptions", `${call.interruptions}`],
              ["Filler words", `${call.fillerWords}`],
              ["Dead air", call.deadAir],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-border bg-secondary/30 p-3">
                <p className="text-muted-foreground">{k}</p>
                <p className="mt-1 font-mono text-sm">{v}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="lg:col-span-2">
          <PanelHeader title="Conversation timeline" subtitle="Every stage scored and coached" />
          <div className="space-y-4 p-5">
            {callStages.map((s) => (
              <div key={s.stage} className="grid gap-2 sm:grid-cols-[120px_1fr]">
                <div>
                  <p className="text-sm font-medium">{s.stage}</p>
                  <p className="font-mono text-xs text-muted-foreground">{s.score}/100</p>
                </div>
                <div>
                  <Meter value={s.score} />
                  <p className="mt-2 text-xs text-muted-foreground">{s.feedback}</p>
                  <p className="mt-1 flex gap-1.5 text-xs text-cyan">
                    <Sparkles className="mt-0.5 size-3 shrink-0" />
                    {s.suggestion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Objection handling" subtitle="What was said vs. what should have been said" />
          <div className="space-y-4 p-5">
            {objections.map((o) => (
              <div key={o.objection} className="rounded-xl border border-border bg-secondary/25 p-4">
                <p className="text-xs text-muted-foreground">Customer</p>
                <p className="mt-1 text-sm">"{o.objection}"</p>
                <p className="mt-3 text-xs text-muted-foreground">Your response</p>
                <p className="mt-1 text-sm text-destructive/90">"{o.response}"</p>
                <p className="mt-3 text-xs text-cyan">Better response</p>
                <p className="mt-1 text-sm">"{o.better}"</p>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelHeader title="Missing information" subtitle="Checklist coverage detected by Iris" />
            <div className="grid gap-2 p-5 sm:grid-cols-2">
              {missingInfo.map((m) => (
                <div
                  key={m.item}
                  className="flex items-center gap-2 rounded-lg border border-border bg-secondary/25 px-3 py-2 text-sm"
                >
                  {m.covered ? (
                    <Check className="size-3.5 text-success" />
                  ) : (
                    <X className="size-3.5 text-destructive" />
                  )}
                  <span className={m.covered ? "" : "text-muted-foreground"}>{m.item}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Personality analysis" subtitle="Signals detected across the call" />
            <div className="h-72 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={personality} outerRadius="72%">
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis
                    dataKey="trait"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  />
                  <Tooltip {...chartTooltip} />
                  <Radar
                    dataKey="value"
                    stroke="var(--violet)"
                    fill="var(--violet)"
                    fillOpacity={0.28}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>

      <Panel className="gradient-border mt-4 p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">Why this deal didn't close faster</h3>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Marcus signalled buying intent at 06:40 when he asked about onboarding timelines, but the
          conversation returned to features for another four minutes. The pricing objection at 06:12
          was never fully resolved — you moved on after 9 seconds. Iris estimates the deal is still{" "}
          <span className="text-success">78% likely to close</span> if you send a written objection
          recap within 24 hours and re-anchor on execution speed rather than spread.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Send objection recap", "Book technical call", "Share execution benchmark"].map((a) => (
            <button
              key={a}
              className="rounded-lg border border-border bg-secondary/40 px-3 py-1.5 text-xs transition-colors hover:bg-secondary"
            >
              {a}
            </button>
          ))}
        </div>
      </Panel>
    </>
  );
}
