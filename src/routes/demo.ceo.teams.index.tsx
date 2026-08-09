import { createFileRoute, Link } from "@tanstack/react-router";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { Chip, PageHeading, Panel, PanelHeader } from "@/components/iris/primitives";
import { demoService } from "@/lib/demo/demo-service";

export const Route = createFileRoute("/demo/ceo/teams/")({
  component: TeamsPage,
});

function TeamsPage() {
  const { data: teams, loading } = useDemoQuery(() => demoService.getTeams(), []);
  if (loading || !teams) return <DemoLoading />;
  return (
    <DemoPage>
      <PageHeading title="Teams" subtitle="Apex Markets sales desks" action={<Chip tone="iris">Demo</Chip>} />
      <div className="grid gap-3 md:grid-cols-2">
        {teams.map((t) => (
          <Link key={t.id} to="/demo/ceo/teams/$teamId" params={{ teamId: t.id }}>
            <Panel className="p-5 transition-colors hover:border-primary/40">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">Manager: {t.managerName}</p>
                </div>
                <Chip tone={t.id === "team-velocity" ? "warn" : "good"}>
                  {t.id === "team-velocity" ? "Needs attention" : "On track"}
                </Chip>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <span>Deposits €{(t.deposits / 1000).toFixed(0)}K</span>
                <span>FTDs {t.ftds}</span>
                <span>Conversion {t.conversion}%</span>
                <span>AI quality {t.avgQuality}</span>
                <span>Calls {t.calls}</span>
                <span>Agents {t.agents}</span>
              </div>
            </Panel>
          </Link>
        ))}
      </div>
    </DemoPage>
  );
}
