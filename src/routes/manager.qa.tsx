import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeading, Panel, PanelHeader, Chip, Meter } from "@/components/iris/primitives";
import { calls } from "@/lib/iris-data";
import {
  coachingPlans,
  managerQaWorkspace,
} from "@/lib/revenue-intelligence-data";
import { qaQueue } from "@/lib/revenue-os-data";

const highlights = [
  { label: "Calls requiring review", value: String(qaQueue.length + 2) },
  { label: "AI-flagged", value: "7" },
  { label: "Compliance high-risk", value: "2" },
  { label: "Reps needing attention", value: "2" },
  { label: "Pending certifications", value: "3" },
  { label: "Active coaching plans", value: String(coachingPlans.filter((p) => p.status === "Active").length) },
];

export const Route = createFileRoute("/manager/qa")({
  head: () => ({
    meta: [
      { title: "QA & Coaching Workspace — Artemis Manager" },
      { name: "description", content: "Unified QA review, coaching assignments, and manager copilot." },
    ],
  }),
  component: ManagerQaWorkspace,
});

function ManagerQaWorkspace() {
  const [openCall, setOpenCall] = useState(calls[0]?.id ?? "c-1841");
  const call = calls.find((c) => c.id === openCall) ?? calls[0];
  const [selection, setSelection] = useState<string | null>(null);
  const [copilotQ, setCopilotQ] = useState(0);

  return (
    <>
      <PageHeading
        title="QA & coaching workspace"
        subtitle="Review flagged calls, assign coaching, and ask the manager copilot — connected to DNA and CRM outcomes"
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {highlights.map((h) => (
          <Panel key={h.label} className="p-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{h.label}</p>
            <p className="mt-1 font-mono text-xl font-semibold">{h.value}</p>
          </Panel>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.1fr_0.9fr]">
        <Panel>
          <PanelHeader title="Review queue" subtitle="AI flags + compliance + lost-deal calls" />
          <div className="divide-y divide-border">
            {qaQueue.map((q) => (
              <button
                key={q.call}
                type="button"
                onClick={() => setOpenCall(calls[0]?.id ?? openCall)}
                className="flex w-full flex-col gap-1 px-4 py-3 text-left hover:bg-secondary/40"
              >
                <p className="text-sm font-medium">{q.call}</p>
                <p className="text-xs text-muted-foreground">{q.rep}</p>
                <Chip tone={q.severity === "Critical" ? "bad" : q.severity === "High" ? "warn" : "neutral"}>
                  {q.flag}
                </Chip>
              </button>
            ))}
            {calls.slice(0, 4).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setOpenCall(c.id)}
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left hover:bg-secondary/40"
              >
                <div>
                  <p className="text-sm font-medium">{c.prospect}</p>
                  <p className="text-xs text-muted-foreground">{c.company}</p>
                </div>
                <Chip tone={(c.score ?? 0) >= 75 ? "good" : "warn"}>{c.score}</Chip>
              </button>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title={call ? `Review · ${call.prospect}` : "Select a call"}
            subtitle="Recording · transcript · scorecards · coaching"
            action={
              call ? (
                <Link
                  to="/app/calls/$callId"
                  params={{ callId: call.id }}
                  className="text-xs text-primary hover:underline"
                >
                  Full analysis
                </Link>
              ) : null
            }
          />
          {call ? (
            <div className="space-y-4 p-5">
              <div className="flex h-12 items-center gap-3 rounded-xl border border-border bg-secondary/30 px-4">
                <div className="h-2 flex-1 rounded-full bg-secondary">
                  <div className="h-2 w-2/3 rounded-full gradient-surface" />
                </div>
                <span className="font-mono text-xs">{call.duration}</span>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  ["00:41", "Customer", "I'm not sure we need another platform."],
                  ["01:20", "Rep", "What's the biggest gap between top and bottom closers?"],
                  ["03:38", "Customer", "Your competitor is cheaper."],
                ].map(([t, who, text]) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelection(String(text))}
                    className="block w-full rounded-lg border border-transparent px-2 py-1.5 text-left hover:border-primary/30 hover:bg-primary/5"
                  >
                    <span className="font-mono text-[10px] text-muted-foreground">{t}</span>{" "}
                    <span className="text-xs font-medium">{who}: </span>
                    <span className="text-xs text-muted-foreground">{text}</span>
                  </button>
                ))}
              </div>
              {selection ? (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
                  <p className="text-xs font-medium">Turn selection into…</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {[
                      "Coaching feedback",
                      "Best-practice example",
                      "Roleplay scenario",
                      "Playbook example",
                      "Team lesson",
                      "QA issue",
                    ].map((a) => (
                      <button
                        key={a}
                        type="button"
                        className="rounded-lg border border-border px-2 py-1 text-[10px] hover:bg-secondary"
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-border p-3">
                  <p className="text-muted-foreground">AI scorecard</p>
                  <p className="mt-1 font-mono text-2xl">{call.score}</p>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <p className="text-muted-foreground">Human QA</p>
                  <p className="mt-1 font-mono text-2xl">—</p>
                  <button type="button" className="mt-1 text-primary hover:underline">
                    Score now
                  </button>
                </div>
              </div>
              <Link to="/manager/coaching" className="text-xs text-primary hover:underline">
                Assign coaching from this call →
              </Link>
            </div>
          ) : null}
        </Panel>

        <div className="space-y-4">
          <Panel className="p-4">
            <p className="text-xs font-semibold">Manager copilot</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {managerQaWorkspace.copilotAnswers.map((c, i) => (
                <button
                  key={c.q}
                  type="button"
                  onClick={() => setCopilotQ(i)}
                  className="rounded-lg border border-border px-2 py-1 text-[10px] hover:bg-secondary"
                >
                  {c.q}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              {managerQaWorkspace.copilotAnswers[copilotQ]?.a}
            </p>
          </Panel>

          <Panel>
            <PanelHeader title="Team skill heatmap" />
            <div className="overflow-x-auto p-3">
              <table className="w-full text-left text-xs">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="p-2">Rep</th>
                    <th className="p-2">Disc</th>
                    <th className="p-2">Obj</th>
                    <th className="p-2">Close</th>
                    <th className="p-2">Comp</th>
                  </tr>
                </thead>
                <tbody>
                  {managerQaWorkspace.heatmap.map((r) => (
                    <tr key={r.rep} className="border-t border-border">
                      <td className="p-2 font-medium">{r.rep}</td>
                      <td className="p-2 font-mono">{r.discovery}</td>
                      <td className="p-2 font-mono">{r.objections}</td>
                      <td className="p-2 font-mono">{r.close}</td>
                      <td className="p-2 font-mono">{r.compliance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel className="p-4">
            <p className="text-xs font-semibold">Coaching effectiveness</p>
            {coachingPlans.slice(0, 3).map((p) => (
              <div key={p.id} className="mt-3">
                <div className="flex justify-between text-xs">
                  <span>{p.agent}</span>
                  <span className="font-mono">
                    {p.beforeScore}→{p.afterScore}
                  </span>
                </div>
                <Meter value={p.completion} />
                <p className="mt-1 text-[10px] text-muted-foreground">{p.businessOutcome}</p>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </>
  );
}
