import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Flame, TrendingUp, Shield } from "lucide-react";
import { PageHeading, Panel, PanelHeader, Chip } from "@/components/iris/primitives";
import { leaderboard, employees } from "@/lib/iris-data";

export const Route = createFileRoute("/app/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — Iris Rep Workspace" },
      { name: "description", content: "Top closers, most improved and best objection handling." },
      { property: "og:title", content: "Leaderboard — Iris Rep Workspace" },
      { property: "og:description", content: "Top closers, most improved and best objection handling." },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  return (
    <>
      <PageHeading title="Leaderboard" subtitle="Company-wide · July" />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Trophy, t: "Top closer", n: "Alex Moreau", v: "34% close rate" },
          { icon: TrendingUp, t: "Most improved", n: "Nadia Petrova", v: "+14 pts" },
          { icon: Shield, t: "Best objections", n: "Priya Nair", v: "88 score" },
          { icon: Flame, t: "Longest streak", n: "Lena Fischer", v: "12 days" },
        ].map((c) => (
          <Panel key={c.t} className="p-5">
            <c.icon className="size-4 text-primary" />
            <p className="mt-3 text-xs text-muted-foreground">{c.t}</p>
            <p className="mt-1 text-sm font-semibold">{c.n}</p>
            <p className="font-mono text-xs text-muted-foreground">{c.v}</p>
          </Panel>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="This month's podium" />
          <div className="divide-y divide-border">
            {leaderboard.map((r) => (
              <div key={r.rank} className="flex items-center gap-4 px-5 py-3.5">
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-lg font-mono text-xs ${
                    r.rank === 1 ? "gradient-surface text-background" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {r.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.metric}</p>
                </div>
                <Chip tone="iris">{r.badge}</Chip>
                <span className="font-mono text-sm">{r.score}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Full ranking" subtitle="By AI score" />
          <div className="divide-y divide-border">
            {[...employees]
              .sort((a, b) => b.score - a.score)
              .map((e, i) => (
                <div key={e.id} className="flex items-center gap-4 px-5 py-3">
                  <span className="w-5 font-mono text-xs text-muted-foreground">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      {e.name}
                      {e.name === "Alex Moreau" ? (
                        <span className="ml-2 text-[11px] text-primary">you</span>
                      ) : null}
                    </p>
                    <p className="text-xs text-muted-foreground">{e.dept}</p>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{e.closeRate}%</span>
                  <span className="font-mono text-sm">{e.score}</span>
                </div>
              ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
