import { createFileRoute, Link } from "@tanstack/react-router";
import { DemoPage } from "@/components/demo/demo-shell";
import { Chip, PageHeading, Panel, PanelHeader } from "@/components/iris/primitives";

export const Route = createFileRoute("/demo/agent/goals")({
  component: AgentGoalsPage,
});

function AgentGoalsPage() {
  return (
    <DemoPage>
      <PageHeading title="Goals" subtitle="Personal targets · not surveillance" action={<Chip tone="iris">Demo</Chip>} />
      <Panel>
        <PanelHeader title="This week" />
        <div className="space-y-3 p-5 text-sm">
          <p>Closing 76 → 80</p>
          <p>Complete 1 withdrawal-objection roleplay</p>
          <p>Follow up Client 10821 before 17:00</p>
          <Link to="/demo/agent/practice" className="text-primary hover:underline">
            Start practice →
          </Link>
        </div>
      </Panel>
    </DemoPage>
  );
}
