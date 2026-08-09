import { createFileRoute, Link } from "@tanstack/react-router";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { Chip, PageHeading, Panel, PanelHeader, StatCard } from "@/components/iris/primitives";
import { demoService } from "@/lib/demo/demo-service";

export const Route = createFileRoute("/demo/ceo/agents/$agentId")({
  component: AgentProfilePage,
});

function AgentProfilePage() {
  const { agentId } = Route.useParams();
  const { data: agent, loading } = useDemoQuery(() => demoService.getAgent(agentId), [agentId]);
  const { data: calls } = useDemoQuery(() => demoService.getCalls({ agentId }), [agentId]);

  if (loading || !agent) return <DemoLoading />;

  const radar = [
    { skill: "Confidence", value: agent.skills.confidence },
    { skill: "Discovery", value: agent.skills.discovery },
    { skill: "Listening", value: agent.skills.listening },
    { skill: "Product", value: agent.skills.productKnowledge },
    { skill: "Objections", value: agent.skills.objectionHandling },
    { skill: "Closing", value: agent.skills.closing },
    { skill: "Compliance", value: agent.skills.compliance },
  ];

  return (
    <DemoPage>
      <PageHeading
        title={agent.name}
        subtitle={`${agent.teamName} · Rep DNA™`}
        action={<Chip tone="iris">Demo profile</Chip>}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Calls" value={`${agent.calls}`} />
        <StatCard label="FTDs" value={`${agent.ftds}`} />
        <StatCard label="Conversion" value={`${agent.conversion}%`} delta={agent.trend} />
        <StatCard label="Deposits" value={`€${(agent.deposits / 1000).toFixed(1)}K`} />
        <StatCard label="AI score" value={`${agent.aiScore}`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Rep DNA™" subtitle="Simulated skill model" />
          <div className="h-64 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10 }} />
                <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 px-5 pb-4 text-xs">
            <Chip tone="good">Strongest: {agent.skills.strongest}</Chip>
            <Chip tone="iris">{agent.skills.fastestImproving}</Chip>
            <Chip tone="warn">Focus: {agent.skills.focusThisWeek}</Chip>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Recent calls" />
          <div className="divide-y divide-border">
            {(calls ?? []).map((c) => (
              <Link
                key={c.id}
                to="/demo/calls/$callId"
                params={{ callId: c.id }}
                className="block px-5 py-3 text-sm hover:bg-secondary/40"
              >
                <div className="flex justify-between gap-2">
                  <span className="font-medium">{c.contactLabel}</span>
                  <span className="font-mono text-xs">{c.aiScore || "—"}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {c.outcome} · {c.primaryObjection}
                </p>
              </Link>
            ))}
            {!calls?.length ? <p className="p-5 text-sm text-muted-foreground">No calls in demo set.</p> : null}
          </div>
          {agent.id === "agt-daniel" ? (
            <div className="border-t border-border px-5 py-4 text-sm">
              <p className="font-medium">Story beat</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Closing dropped — open the lost high-intent call and jump to 08:14.
              </p>
              <Link
                to="/demo/calls/$callId"
                params={{ callId: "call-daniel-lost" }}
                className="mt-2 inline-flex text-xs text-primary hover:underline"
              >
                Open lost call →
              </Link>
              <Link
                to="/demo/manager/coaching"
                className="ml-3 inline-flex text-xs text-primary hover:underline"
              >
                Assign coaching →
              </Link>
            </div>
          ) : null}
        </Panel>
      </div>
    </DemoPage>
  );
}
