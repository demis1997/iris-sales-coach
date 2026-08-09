import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { chartTooltip } from "@/components/iris/chart-bits";
import { PageHeading, Panel, PanelHeader } from "@/components/iris/primitives";
import { demoService } from "@/lib/demo/demo-service";

export const Route = createFileRoute("/demo/ceo/revenue")({
  component: RevenuePage,
});

function RevenuePage() {
  const { data: teams, loading } = useDemoQuery(() => demoService.getTeams(), []);
  if (loading || !teams) return <DemoLoading />;
  return (
    <DemoPage>
      <PageHeading title="Revenue" subtitle="Deposits by desk · Demo period" />
      <Panel>
        <PanelHeader title="Team deposits" />
        <div className="h-72 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teams}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip {...chartTooltip} />
              <Bar dataKey="deposits" name="Deposits €" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <p className="text-xs text-muted-foreground">
        Jump to{" "}
        <Link to="/demo/ceo/teams/$teamId" params={{ teamId: "team-velocity" }} className="text-primary hover:underline">
          Velocity Desk
        </Link>{" "}
        for the conversion story.
      </p>
    </DemoPage>
  );
}
