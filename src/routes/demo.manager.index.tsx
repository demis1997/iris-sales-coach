import { createFileRoute, Link } from "@tanstack/react-router";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { Chip, Panel, PanelHeader } from "@/components/iris/primitives";
import { AIInsight, KPICard, PageHeader, StatusBadge } from "@/components/product/ui";
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
      <PageHeader
        title="3 things need your attention"
        subtitle="Sarah Mitchell · Alpha Desk — action-oriented floor view"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Team conversion" value="16.8%" delta={4} />
        <KPICard label="Deposits today" value="€48.2K" delta={9} />
        <KPICard label="Calls" value="812" />
        <KPICard label="Coaching tasks" value="7 open" hint="Open assignments this week" />
      </div>

      <Panel>
        <PanelHeader
          title="Needs your attention"
          subtitle="Priority queue for the floor"
          action={<StatusBadge tone="warn">3</StatusBadge>}
        />
        <div className="divide-y divide-border">
          {attention.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[15px] font-semibold">{a.agentName}</p>
                  <Chip tone={a.tone}>{a.tone}</Chip>
                </div>
                <p className="mt-1 text-sm">{a.title}</p>
                <p className="mt-1 text-[13px] text-muted-foreground">{a.detail}</p>
              </div>
              <div className="flex items-center gap-2">
                {a.hrefCallId ? (
                  <Link
                    to="/demo/calls/$callId"
                    params={{ callId: a.hrefCallId }}
                    className="product-btn-primary !px-4 !py-2 text-xs"
                  >
                    {a.action}
                  </Link>
                ) : a.hrefAgentId ? (
                  <Link
                    to="/demo/ceo/agents/$agentId"
                    params={{ agentId: a.hrefAgentId }}
                    className="product-btn-primary !px-4 !py-2 text-xs"
                  >
                    {a.action}
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <PanelHeader
            title="Team performance"
            subtitle="Alpha Desk"
            action={
              <Link to="/demo/manager/team" className="text-[13px] font-semibold text-[#2EE6A6] hover:underline">
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
                className="flex justify-between px-6 py-3.5 text-sm hover:bg-secondary/40"
              >
                <span>{a.name}</span>
                <span className="text-[13px] text-muted-foreground">
                  {a.conversion}% · AI {a.aiScore}
                </span>
              </Link>
            ))}
          </div>
        </Panel>

        <AIInsight title="Artemis Coach" subtitle="What your best agents are doing differently">
          <ul className="space-y-2.5 text-[14px] leading-relaxed text-[#C5D0E0]">
            {(patterns ?? []).map((p) => (
              <li key={p} className="flex gap-2">
                <span className="text-[#2EE6A6]">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/demo/manager/live" className="product-btn-secondary !px-4 !py-2 text-xs">
              Open Live Floor
            </Link>
            <Link to="/demo/manager/coaching" className="product-btn-ghost text-xs">
              Coaching queue →
            </Link>
          </div>
        </AIInsight>
      </div>
    </DemoPage>
  );
}
