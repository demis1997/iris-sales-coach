import { createFileRoute, Link } from "@tanstack/react-router";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { Chip, PageHeading, Panel, PanelHeader, StatCard } from "@/components/iris/primitives";
import { demoService } from "@/lib/demo/demo-service";

export const Route = createFileRoute("/demo/ceo/teams/$teamId")({
  component: TeamDetailPage,
});

function TeamDetailPage() {
  const { teamId } = Route.useParams();
  const { data: team, loading } = useDemoQuery(() => demoService.getTeam(teamId), [teamId]);
  const { data: agents } = useDemoQuery(() => demoService.getAgents(teamId), [teamId]);

  if (loading || !team) return <DemoLoading />;

  return (
    <DemoPage>
      <PageHeading
        title={team.name}
        subtitle={`Manager ${team.managerName} · ${team.agents} agents`}
        action={
          team.id === "team-velocity" ? <Chip tone="warn">Converts 23% below company avg</Chip> : <Chip tone="good">Healthy</Chip>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Deposits" value={`€${(team.deposits / 1000).toFixed(0)}K`} />
        <StatCard label="FTDs" value={`${team.ftds}`} />
        <StatCard label="Conversion" value={`${team.conversion}%`} />
        <StatCard label="Calls" value={`${team.calls}`} />
        <StatCard label="AI quality" value={`${team.avgQuality}`} />
      </div>

      {team.id === "team-velocity" ? (
        <Panel className="border-warning/30 bg-warning/5 p-5 text-sm">
          <p className="font-medium">Demo insight</p>
          <p className="mt-1 text-muted-foreground">
            High volume, weak conversion — start with Daniel Petrou. He generates dials but misses close windows
            after buying signals.
          </p>
          <Link
            to="/demo/ceo/agents/$agentId"
            params={{ agentId: "agt-daniel" }}
            className="mt-3 inline-flex text-xs text-primary hover:underline"
          >
            Open Daniel Petrou →
          </Link>
        </Panel>
      ) : null}

      <Panel>
        <PanelHeader title="Agents" subtitle="Click for profile" />
        <div className="divide-y divide-border">
          {(agents ?? []).map((a) => (
            <Link
              key={a.id}
              to="/demo/ceo/agents/$agentId"
              params={{ agentId: a.id }}
              className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm hover:bg-secondary/40"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-semibold">
                  {a.initials}
                </span>
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.calls} calls · {a.ftds} FTDs · {a.conversion}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Chip tone={a.trend < 0 ? "bad" : "good"}>
                  {a.trend >= 0 ? "+" : ""}
                  {a.trend}%
                </Chip>
                <span className="font-mono text-xs">{a.aiScore}</span>
              </div>
            </Link>
          ))}
        </div>
      </Panel>
    </DemoPage>
  );
}
