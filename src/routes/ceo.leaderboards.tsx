import { createFileRoute } from "@tanstack/react-router";
import { Trophy, TrendingUp, Zap, Waves, Shield, Flame } from "lucide-react";
import { PageHeading, Panel, PanelHeader } from "@/components/iris/primitives";
import { employees } from "@/lib/iris-data";

export const Route = createFileRoute("/ceo/leaderboards")({
  head: () => ({
    meta: [
      { title: "Leaderboards — Iris Executive" },
      { name: "description", content: "Top closers, fastest learners and highest confidence across the company." },
      { property: "og:title", content: "Leaderboards — Iris Executive" },
      { property: "og:description", content: "Top closers, fastest learners and highest confidence." },
    ],
  }),
  component: LeaderboardsPage,
});

const boards = [
  { icon: Trophy, title: "Top closer", key: "closeRate" as const, unit: "%" },
  { icon: TrendingUp, title: "Most improved", key: "trend" as const, unit: "%" },
  { icon: Zap, title: "Fastest learner", key: "score" as const, unit: "" },
  { icon: Waves, title: "Highest confidence", key: "confidence" as const, unit: "%" },
  { icon: Shield, title: "Best objection handling", key: "score" as const, unit: "" },
  { icon: Flame, title: "Longest streak", key: "calls" as const, unit: " calls" },
];

function LeaderboardsPage() {
  return (
    <>
      <PageHeading title="Leaderboards" subtitle="Company-wide rankings · July 2026" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {boards.map((b) => {
          const ranked = [...employees].sort((x, y) => y[b.key] - x[b.key]).slice(0, 5);
          return (
            <Panel key={b.title}>
              <PanelHeader title={b.title} />
              <div className="divide-y divide-border">
                {ranked.map((e, i) => (
                  <div key={e.id} className="flex items-center gap-3 px-5 py-3">
                    <span
                      className={`grid size-6 shrink-0 place-items-center rounded-lg font-mono text-[11px] ${
                        i === 0 ? "gradient-surface text-background" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{e.name}</p>
                      <p className="text-[11px] text-muted-foreground">{e.dept}</p>
                    </div>
                    <span className="font-mono text-sm">
                      {e[b.key]}
                      {b.unit}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-border px-5 py-3 text-xs text-muted-foreground">
                <b.icon className="size-3.5 text-primary" /> Updated hourly
              </div>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
