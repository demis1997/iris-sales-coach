import { createFileRoute, Link } from "@tanstack/react-router";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { Chip, PageHeading, Panel, PanelHeader } from "@/components/iris/primitives";
import { DEMO_COMPANY } from "@/data/demo/company";
import { demoService } from "@/lib/demo/demo-service";

export const Route = createFileRoute("/demo/agent/dna")({
  component: AgentDnaPage,
});

function AgentDnaPage() {
  const { data: agent, loading } = useDemoQuery(() => demoService.getAgent(DEMO_COMPANY.defaultAgentId), []);
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
      <PageHeading title="Rep DNA™" subtitle="Your evolving skill model" action={<Chip tone="iris">Demo</Chip>} />
      <Panel>
        <div className="h-72 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
              <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-2 px-5 pb-5">
          <Chip tone="good">Strongest: {agent.skills.strongest}</Chip>
          <Chip tone="iris">Fastest improving: {agent.skills.fastestImproving}</Chip>
          <Chip tone="warn">Focus: {agent.skills.focusThisWeek}</Chip>
        </div>
      </Panel>
      <Panel>
        <PanelHeader title="Skill timeline · Closing" subtitle="30-day demo narrative" />
        <div className="space-y-3 p-5 text-sm text-muted-foreground">
          <p>Day 1–7: Closing 68 — missed asks after buying signals.</p>
          <p>Day 8–14: Coaching assigned · roleplay completed → 72.</p>
          <p>Day 15–30: Closing 76 — trust handling improved; soft closes still inconsistent.</p>
          <Link to="/demo/calls/$callId" params={{ callId: "call-maria-followup" }} className="text-primary hover:underline">
            Call influencing score →
          </Link>
        </div>
      </Panel>
    </DemoPage>
  );
}
