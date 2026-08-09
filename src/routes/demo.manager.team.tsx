import { createFileRoute, Link } from "@tanstack/react-router";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { Chip, PageHeading, Panel } from "@/components/iris/primitives";
import { demoService } from "@/lib/demo/demo-service";

export const Route = createFileRoute("/demo/manager/team")({
  component: ManagerTeamPage,
});

function ManagerTeamPage() {
  const { data: agents, loading } = useDemoQuery(() => demoService.getAgents("team-alpha"), []);
  if (loading || !agents) return <DemoLoading />;
  return (
    <DemoPage>
      <PageHeading title="Alpha Desk team" subtitle="Calls · FTDs · conversion · coaching" />
      <Panel className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-[11px] text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">Agent</th>
              <th className="px-2 py-3">Calls</th>
              <th className="px-2 py-3">Reached</th>
              <th className="px-2 py-3">FTDs</th>
              <th className="px-2 py-3">Conv.</th>
              <th className="px-2 py-3">Deposits</th>
              <th className="px-2 py-3">AI</th>
              <th className="px-2 py-3">Trend</th>
              <th className="px-4 py-3">Coaching</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {agents.map((a) => (
              <tr key={a.id} className="hover:bg-secondary/30">
                <td className="px-4 py-2.5">
                  <Link to="/demo/ceo/agents/$agentId" params={{ agentId: a.id }} className="text-primary hover:underline">
                    {a.name}
                  </Link>
                </td>
                <td className="px-2 py-2.5 font-mono text-xs">{a.calls}</td>
                <td className="px-2 py-2.5 font-mono text-xs">{a.reached}</td>
                <td className="px-2 py-2.5 font-mono text-xs">{a.ftds}</td>
                <td className="px-2 py-2.5 font-mono text-xs">{a.conversion}%</td>
                <td className="px-2 py-2.5 font-mono text-xs">€{(a.deposits / 1000).toFixed(1)}K</td>
                <td className="px-2 py-2.5 font-mono text-xs">{a.aiScore}</td>
                <td className="px-2 py-2.5">
                  <Chip tone={a.trend < 0 ? "bad" : "good"}>
                    {a.trend >= 0 ? "+" : ""}
                    {a.trend}%
                  </Chip>
                </td>
                <td className="px-4 py-2.5 text-xs capitalize">{a.coachingStatus.replace("_", " ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </DemoPage>
  );
}
