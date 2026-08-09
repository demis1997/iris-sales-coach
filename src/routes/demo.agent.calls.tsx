import { createFileRoute, Link } from "@tanstack/react-router";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { PageHeading, Panel } from "@/components/iris/primitives";
import { DEMO_COMPANY } from "@/data/demo/company";
import { demoService } from "@/lib/demo/demo-service";

export const Route = createFileRoute("/demo/agent/calls")({
  component: AgentCallsPage,
});

function AgentCallsPage() {
  const { data: calls, loading } = useDemoQuery(
    () => demoService.getCalls({ agentId: DEMO_COMPANY.defaultAgentId }),
    [],
  );
  if (loading || !calls) return <DemoLoading />;
  return (
    <DemoPage>
      <PageHeading title="My calls" subtitle="Maria Georgiou · scored with forex playbook" />
      <Panel className="divide-y divide-border">
        {calls.map((c) => (
          <Link
            key={c.id}
            to="/demo/calls/$callId"
            params={{ callId: c.id }}
            className="flex justify-between px-5 py-3 text-sm hover:bg-secondary/40"
          >
            <span>
              {c.contactLabel} · {c.outcome}
            </span>
            <span className="font-mono text-xs">{c.aiScore || "live"}</span>
          </Link>
        ))}
      </Panel>
    </DemoPage>
  );
}
