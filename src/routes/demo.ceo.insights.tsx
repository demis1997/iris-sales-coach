import { createFileRoute, Link } from "@tanstack/react-router";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { Chip, PageHeading, Panel, PanelHeader } from "@/components/iris/primitives";
import { demoService } from "@/lib/demo/demo-service";

export const Route = createFileRoute("/demo/ceo/insights")({
  component: InsightsPage,
});

function InsightsPage() {
  const { data: brief, loading } = useDemoQuery(() => demoService.getExecutiveBrief(), []);
  const { data: patterns } = useDemoQuery(() => demoService.getWinningPatterns(), []);
  if (loading || !brief) return <DemoLoading />;
  return (
    <DemoPage>
      <PageHeading title="Insights" subtitle="Simulated executive intelligence" action={<Chip tone="iris">Demo Analysis</Chip>} />
      <Panel>
        <PanelHeader title="Executive brief" />
        <p className="whitespace-pre-line p-5 text-sm text-muted-foreground">{brief.body}</p>
        {"actions" in brief && Array.isArray(brief.actions) ? (
          <ol className="space-y-2 border-t border-border px-5 py-4 text-sm">
            {brief.actions.map((action: string, i: number) => (
              <li key={action} className="flex gap-3">
                <span className="font-semibold text-[#2EE6A6]">{i + 1}.</span>
                <span>{action}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </Panel>
      <Panel>
        <PanelHeader title="What top desks do differently" subtitle="Demo analysis" />
        <ul className="list-disc space-y-2 p-5 pl-9 text-sm text-muted-foreground">
          {(patterns ?? []).map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </Panel>
      <Link to="/demo/ceo/opportunities" className="text-sm text-primary hover:underline">
        Review opportunities →
      </Link>
    </DemoPage>
  );
}
