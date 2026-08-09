import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { Chip, PageHeading, Panel, PanelHeader } from "@/components/iris/primitives";
import { demoService } from "@/lib/demo/demo-service";

export const Route = createFileRoute("/demo/manager/coaching")({
  component: CoachingPage,
});

function CoachingPage() {
  const { data: items, loading } = useDemoQuery(() => demoService.getCoaching(), []);
  if (loading || !items) return <DemoLoading />;

  return (
    <DemoPage>
      <PageHeading title="Coaching center" subtitle="Assign without listening to 50 calls" action={<Chip tone="iris">Demo</Chip>} />
      <div className="space-y-4">
        {items.map((c) => (
          <Panel key={c.id}>
            <PanelHeader title={c.agentName} subtitle={`Weakness: ${c.weakness} · ${c.evidence}`} />
            <div className="space-y-3 p-5 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">AI recommendation: </span>
                {c.recommendation}
              </p>
              <p>
                Assignment: <span className="font-medium">{c.assignment}</span> · Due {c.due}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-xl gradient-surface px-3 py-1.5 text-xs font-semibold text-background"
                  onClick={() => toast.success(`Assigned “${c.assignment}” to ${c.agentName} (demo)`)}
                >
                  Assign coaching
                </button>
                <Link
                  to="/demo/agent/practice"
                  className="rounded-xl border border-border px-3 py-1.5 text-xs"
                  onClick={() => toast.message("Opening roleplay for this weakness")}
                >
                  Start roleplay
                </Link>
                <Link
                  to="/demo/calls/$callId"
                  params={{ callId: "call-daniel-lost" }}
                  className="rounded-xl border border-border px-3 py-1.5 text-xs"
                >
                  Review calls
                </Link>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </DemoPage>
  );
}
