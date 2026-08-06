import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, FileText } from "lucide-react";
import { PageHeading, Panel, PanelHeader, Chip } from "@/components/iris/primitives";
import { knowledgeDocuments, playbookRecommendations } from "@/lib/revenue-intelligence-data";

export const Route = createFileRoute("/app/knowledge")({
  head: () => ({
    meta: [{ title: "Knowledge Base — Iris AI" }],
  }),
  component: KnowledgePage,
});

function KnowledgePage() {
  return (
    <>
      <PageHeading
        title="Knowledge base"
        subtitle="Approved pricing, battlecards, playbooks and case studies used by Live Coach — never invents facts"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {knowledgeDocuments.map((d) => (
          <Panel key={d.id} className="p-5">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              <h3 className="font-semibold">{d.title}</h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip tone="iris">{d.type}</Chip>
              <span className="text-xs text-muted-foreground">
                {d.chunks} chunks · updated {d.updated}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              If a live suggestion lacks approved content, Iris shows “No approved information available.”
            </p>
          </Panel>
        ))}
      </div>
      <Panel className="mt-4">
        <PanelHeader
          title="Playbook intelligence"
          subtitle="Suggested updates require manager approval before Live Coach / roleplay / QA use them"
          action={
            <Link to="/manager/playbooks" className="text-xs text-primary hover:underline">
              Manager approvals →
            </Link>
          }
        />
        <div className="divide-y divide-border">
          {playbookRecommendations.map((p) => (
            <div key={p.id} className="px-5 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <BookOpen className="size-4 text-primary" />
                <p className="font-medium">{p.title}</p>
                <Chip
                  tone={
                    p.status === "Approved" ? "good" : p.status === "Pending approval" ? "warn" : "iris"
                  }
                >
                  {p.status}
                </Chip>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {p.evidenceCalls} calls · +{p.conversionLift}% conversion · {p.confidence}% confidence ·{" "}
                {p.source}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
