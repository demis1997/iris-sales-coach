import { createFileRoute, Link } from "@tanstack/react-router";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { Chip, PageHeading, Panel } from "@/components/iris/primitives";
import { demoService } from "@/lib/demo/demo-service";

export const Route = createFileRoute("/demo/ceo/calls")({
  component: CeoCallsPage,
});

function CeoCallsPage() {
  const { data: calls, loading } = useDemoQuery(() => demoService.getCalls(), []);
  if (loading || !calls) return <DemoLoading />;
  return (
    <DemoPage>
      <PageHeading title="Calls" subtitle="Example Apex Markets conversations" />
      <Panel className="divide-y divide-border">
        {calls.map((c) => (
          <Link
            key={c.id}
            to="/demo/calls/$callId"
            params={{ callId: c.id }}
            className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm hover:bg-secondary/40"
          >
            <div>
              <p className="font-medium">
                {c.contactLabel} · {c.agentName}
              </p>
              <p className="text-xs text-muted-foreground">
                {c.teamName} · {c.outcome} · {c.duration}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Chip tone={c.intent.includes("high") ? "good" : "neutral"}>{c.intent.replace("_", " ")}</Chip>
              <span className="font-mono text-xs">{c.aiScore || "live"}</span>
            </div>
          </Link>
        ))}
      </Panel>
    </DemoPage>
  );
}
