import { createFileRoute, Link } from "@tanstack/react-router";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { Chip, PageHeading, Panel } from "@/components/iris/primitives";
import { demoService } from "@/lib/demo/demo-service";

export const Route = createFileRoute("/demo/ceo/opportunities")({
  component: OpportunitiesPage,
});

function OpportunitiesPage() {
  const { data: opps, loading } = useDemoQuery(() => demoService.getOpportunities(), []);
  if (loading || !opps) return <DemoLoading />;
  const total = opps.reduce((s, o) => s + o.estimatedValue, 0);
  return (
    <DemoPage>
      <PageHeading
        title="High-intent opportunities"
        subtitle={`€${(total / 1000).toFixed(0)}K estimated opportunity value · not guaranteed revenue`}
        action={<Chip tone="iris">Demo</Chip>}
      />
      <Panel className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-[11px] text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-2 py-3">Agent</th>
              <th className="px-2 py-3">Intent</th>
              <th className="px-2 py-3">Last call</th>
              <th className="px-2 py-3">Objection</th>
              <th className="px-2 py-3">Est. value</th>
              <th className="px-4 py-3">Next action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {opps.map((o) => (
              <tr key={o.id} className="hover:bg-secondary/30">
                <td className="px-4 py-3">
                  <Link to="/demo/calls/$callId" params={{ callId: o.callId }} className="text-primary hover:underline">
                    {o.contactLabel}
                  </Link>
                </td>
                <td className="px-2 py-3 text-xs">{o.agentName}</td>
                <td className="px-2 py-3">
                  <Chip tone={o.intent.includes("high") ? "good" : "neutral"}>{o.intent.replace("_", " ")}</Chip>
                </td>
                <td className="px-2 py-3 text-xs text-muted-foreground">{o.lastCallAgo}</td>
                <td className="px-2 py-3 text-xs">{o.primaryObjection}</td>
                <td className="px-2 py-3 font-mono text-xs">€{o.estimatedValue.toLocaleString()}</td>
                <td className="px-4 py-3 text-xs">{o.nextAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </DemoPage>
  );
}
