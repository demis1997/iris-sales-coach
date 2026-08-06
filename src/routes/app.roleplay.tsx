import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Bot, Play, Sparkles } from "lucide-react";
import { PageHeading, Panel, PanelHeader, Chip, Meter } from "@/components/iris/primitives";
import { roleplayScenarios } from "@/lib/revenue-os-data";

export const Route = createFileRoute("/app/roleplay")({
  head: () => ({
    meta: [
      { title: "AI Roleplay Practice — Iris AI" },
      {
        name: "description",
        content: "Practise against an AI customer — angry buyers, price objections, enterprise procurement — and get scored instantly.",
      },
      { property: "og:title", content: "AI Roleplay Practice — Iris AI" },
      { property: "og:description", content: "Rehearse hard conversations before they cost you a deal." },
    ],
  }),
  component: RoleplayPage,
});

function RoleplayPage() {
  const [active, setActive] = useState(roleplayScenarios[4]!.name);
  const scenario = roleplayScenarios.find((s) => s.name === active)!;

  return (
    <>
      <PageHeading
        title="AI Roleplay"
        subtitle="Iris becomes the customer. Practise the calls that decide your quarter."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {roleplayScenarios.map((s) => (
              <button key={s.name} onClick={() => setActive(s.name)} className="text-left">
                <Panel
                  className={`h-full p-4 transition-colors ${
                    active === s.name ? "border-primary/50 bg-primary/5" : "hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{s.name}</p>
                    <Chip tone={s.level === "Hard" ? "bad" : "warn"}>{s.level}</Chip>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{s.desc}</p>
                  <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                    Best score {s.best}
                  </p>
                </Panel>
              </button>
            ))}
          </div>

          <Panel>
            <PanelHeader
              title={`Session · ${scenario.name}`}
              subtitle="Voice or text · scored on the same DNA dimensions as live calls"
              action={
                <button className="flex items-center gap-1.5 rounded-xl gradient-surface px-3 py-1.5 text-xs font-semibold text-background">
                  <Play className="size-3.5" /> Start roleplay
                </button>
              }
            />
            <div className="space-y-4 p-5">
              {[
                { who: "ai", text: "Before you start — I've heard this pitch three times this month. Why are you 40% more expensive?" },
                { who: "rep", text: "That's fair. Can I ask what the gap between your best and worst closer costs you today?" },
                { who: "ai", text: "You're deflecting. Give me a number." },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}
                  className={`flex gap-3 ${m.who === "rep" ? "flex-row-reverse" : ""}`}
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-[11px] font-semibold text-muted-foreground">
                    {m.who === "ai" ? <Bot className="size-3.5" /> : "AM"}
                  </span>
                  <p
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.who === "rep" ? "bg-primary/15" : "border border-border bg-secondary/30"
                    }`}
                  >
                    {m.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel className="gradient-border p-5 text-center">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">Last session score</p>
            <p className="mt-2 font-mono text-4xl font-semibold gradient-text">{scenario.best}</p>
            <p className="mt-1 text-xs text-muted-foreground">on {scenario.name}</p>
          </Panel>

          <Panel>
            <PanelHeader title="Scored dimensions" subtitle="Same model as live calls" />
            <div className="space-y-3 p-5">
              {[
                ["Composure under pressure", 82],
                ["Value anchoring", 58],
                ["Question quality", 76],
                ["Close attempt", 71],
              ].map(([k, v]) => (
                <div key={String(k)}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-mono">{v}</span>
                  </div>
                  <Meter value={v as number} />
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-5">
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <Sparkles className="size-4 text-primary" /> Coach note
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              You conceded the price frame in 9 seconds. Hold the value anchor for two exchanges
              before discussing numbers — reps who do close this scenario 23% more often.
            </p>
          </Panel>
        </div>
      </div>
    </>
  );
}
