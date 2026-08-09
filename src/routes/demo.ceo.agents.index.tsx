import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { Chip, PageHeading, Panel } from "@/components/iris/primitives";
import { demoService } from "@/lib/demo/demo-service";

export const Route = createFileRoute("/demo/ceo/agents/")({
  component: AgentsPage,
});

function AgentsPage() {
  const { data: agents, loading } = useDemoQuery(() => demoService.getAgents(), []);
  const { data: teams } = useDemoQuery(() => demoService.getTeams(), []);
  const [team, setTeam] = useState("all");
  const filtered = useMemo(
    () => (team === "all" ? agents : agents?.filter((a) => a.teamId === team)) ?? [],
    [agents, team],
  );

  if (loading || !agents) return <DemoLoading />;

  return (
    <DemoPage>
      <PageHeading title="Agents" subtitle="Filter by desk · consistent demo metrics" />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTeam("all")}
          className={`rounded-lg px-3 py-1.5 text-xs ${team === "all" ? "bg-primary/20" : "border border-border"}`}
        >
          All
        </button>
        {(teams ?? []).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTeam(t.id)}
            className={`rounded-lg px-3 py-1.5 text-xs ${team === t.id ? "bg-primary/20" : "border border-border"}`}
          >
            {t.name}
          </button>
        ))}
      </div>
      <Panel className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-[11px] text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">Agent</th>
              <th className="px-2 py-3">Team</th>
              <th className="px-2 py-3">Calls</th>
              <th className="px-2 py-3">FTDs</th>
              <th className="px-2 py-3">Conv.</th>
              <th className="px-2 py-3">Deposits</th>
              <th className="px-2 py-3">AI</th>
              <th className="px-4 py-3">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-secondary/30">
                <td className="px-4 py-2.5">
                  <Link to="/demo/ceo/agents/$agentId" params={{ agentId: a.id }} className="font-medium text-primary hover:underline">
                    {a.name}
                  </Link>
                </td>
                <td className="px-2 py-2.5 text-xs">{a.teamName}</td>
                <td className="px-2 py-2.5 font-mono text-xs">{a.calls}</td>
                <td className="px-2 py-2.5 font-mono text-xs">{a.ftds}</td>
                <td className="px-2 py-2.5 font-mono text-xs">{a.conversion}%</td>
                <td className="px-2 py-2.5 font-mono text-xs">€{(a.deposits / 1000).toFixed(1)}K</td>
                <td className="px-2 py-2.5 font-mono text-xs">{a.aiScore}</td>
                <td className="px-4 py-2.5">
                  <Chip tone={a.trend < 0 ? "bad" : "good"}>
                    {a.trend >= 0 ? "+" : ""}
                    {a.trend}%
                  </Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </DemoPage>
  );
}
