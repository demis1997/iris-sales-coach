import { createFileRoute, Link } from "@tanstack/react-router";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { Chip, PageHeading, Panel, PanelHeader, StatCard } from "@/components/iris/primitives";
import { demoService } from "@/lib/demo/demo-service";

export const Route = createFileRoute("/demo/manager/")({
  component: ManagerOverviewPage,
});

function ManagerOverviewPage() {
  const { data: attention, loading } = useDemoQuery(() => demoService.getManagerAttention(), []);
  const { data: patterns } = useDemoQuery(() => demoService.getWinningPatterns(), []);
  const { data: agents } = useDemoQuery(() => demoService.getAgents("team-alpha"), []);

  if (loading || !attention) return <DemoLoading />;

  return (
    <DemoPage>
      <PageHeading
        title="Your team needs attention in 3 places."
        subtitle="Sarah Mitchell · Alpha Desk · action-oriented floor view"
        action={<Chip tone="iris">Demo Workspace</Chip>}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Team conversion" value="16.8%" delta={4} />
        <StatCard label="Deposits today" value="€48.2K" delta={9} />
        <StatCard label="Calls" value="812" />
        <StatCard label="AI Quality" value="84 / 100" delta={3} />
        <StatCard label="Coaching tasks" value="7 open" />
      </div>

      <Panel className="border-primary/25">
        <PanelHeader title="Needs your attention" subtitle="Hero queue for the floor" action={<Chip tone="warn">3</Chip>} />
        <div className="divide-y divide-border">
          {attention.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="text-sm font-semibold">{a.agentName}</p>
                <p className="text-sm">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.detail}</p>
              </div>
              <div className="flex items-center gap-2">
                <Chip tone={a.tone}>{a.tone}</Chip>
                {a.hrefCallId ? (
                  <Link
                    to="/demo/calls/$callId"
                    params={{ callId: a.hrefCallId }}
                    className="rounded-xl gradient-surface px-3 py-1.5 text-xs font-semibold text-background"
                  >
                    {a.action}
                  </Link>
                ) : a.hrefAgentId ? (
                  <Link
                    to="/demo/ceo/agents/$agentId"
                    params={{ agentId: a.hrefAgentId }}
                    className="rounded-xl gradient-surface px-3 py-1.5 text-xs font-semibold text-background"
                  >
                    {a.action}
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader
            title="Team table"
            subtitle="Alpha Desk"
            action={
              <Link to="/demo/manager/team" className="text-xs text-primary hover:underline">
                Full table
              </Link>
            }
          />
          <div className="divide-y divide-border">
            {(agents ?? []).slice(0, 6).map((a) => (
              <Link
                key={a.id}
                to="/demo/ceo/agents/$agentId"
                params={{ agentId: a.id }}
                className="flex justify-between px-5 py-3 text-sm hover:bg-secondary/40"
              >
                <span>{a.name}</span>
                <span className="text-xs text-muted-foreground">
                  {a.conversion}% · AI {a.aiScore}
                </span>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="What your best agents are doing differently" subtitle="Demo analysis" />
          <ul className="list-disc space-y-2 p-5 pl-9 text-sm text-muted-foreground">
            {(patterns ?? []).map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 border-t border-border px-5 py-4">
            <Link to="/demo/manager/live" className="rounded-xl border border-border px-3 py-1.5 text-xs">
              Open live floor
            </Link>
            <Link to="/demo/manager/coaching" className="rounded-xl gradient-surface px-3 py-1.5 text-xs font-semibold text-background">
              Coaching center
            </Link>
          </div>
        </Panel>
      </div>
    </DemoPage>
  );
}
