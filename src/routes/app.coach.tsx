import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Send } from "lucide-react";
import { PageHeading, Panel, PanelHeader, Meter } from "@/components/iris/primitives";
import { coachMessages, callStages } from "@/lib/iris-data";

export const Route = createFileRoute("/app/coach")({
  head: () => ({
    meta: [
      { title: "AI Coach — Iris Rep Workspace" },
      { name: "description", content: "Personal AI coaching after every sales call." },
      { property: "og:title", content: "AI Coach — Iris Rep Workspace" },
      { property: "og:description", content: "Personal AI coaching after every sales call." },
    ],
  }),
  component: CoachPage,
});

function CoachPage() {
  return (
    <>
      <PageHeading
        title="AI Coach"
        subtitle="Coaching from your last call with Marcus Feldman · Feldman Capital"
      />

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
          <Panel className="gradient-border p-5 text-center">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Projected improvement
            </p>
            <p className="mt-2 font-mono text-4xl font-semibold gradient-text">+17%</p>
            <p className="mt-1 text-xs text-muted-foreground">
              if you apply this week's coaching plan
            </p>
          </Panel>

          <Panel>
            <PanelHeader title="Your coaching plan" subtitle="This week" />
            <div className="space-y-3 p-5 text-sm">
              {[
                "Ask 6+ discovery questions before pricing",
                "Pause 2 seconds after every objection",
                "Keep talk ratio under 55%",
                "Confirm decision maker on every first call",
              ].map((t) => (
                <label key={t} className="flex items-start gap-2 text-muted-foreground">
                  <input type="checkbox" className="mt-1 accent-[oklch(0.66_0.2_293)]" />
                  {t}
                </label>
              ))}
            </div>
          </Panel>

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
