import { createFileRoute, Link } from "@tanstack/react-router";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { PageHeading, Panel } from "@/components/iris/primitives";
import { demoService } from "@/lib/demo/demo-service";

export const Route = createFileRoute("/demo/manager/calls")({
  component: ManagerCallsPage,
});

function ManagerCallsPage() {
  const { data: calls, loading } = useDemoQuery(() => demoService.getCalls({ teamId: "team-alpha" }), []);
  if (loading || !calls) return <DemoLoading />;
  return (
    <DemoPage>
      <PageHeading title="Team calls" subtitle="Alpha Desk · review queue" />
      <Panel className="divide-y divide-border">
        {calls.map((c) => (
          <Link
            key={c.id}
            to="/demo/calls/$callId"
            params={{ callId: c.id }}
            className="flex justify-between px-5 py-3 text-sm hover:bg-secondary/40"
          >
            <span>
              {c.contactLabel} · {c.agentName}
            </span>
            <span className="text-xs text-muted-foreground">
              {c.outcome} · {c.aiScore}
            </span>
          </Link>
        ))}
      </Panel>
    </DemoPage>
  );
}
