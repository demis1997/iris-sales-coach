import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeading, Panel, PanelHeader, Chip } from "@/components/iris/primitives";
import { playbookRecommendations } from "@/lib/revenue-intelligence-data";

export const Route = createFileRoute("/manager/playbooks")({
  head: () => ({
    meta: [{ title: "Playbook Intelligence — Artemis Manager" }],
  }),
  component: PlaybooksPage,
});

function PlaybooksPage() {
  const [items, setItems] = useState(playbookRecommendations);

  function setStatus(id: string, status: (typeof playbookRecommendations)[0]["status"]) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  return (
    <>
      <PageHeading
        title="Adaptive playbook intelligence"
        subtitle="Approve, edit, reject, or test recommendations before they reach Live Coach, roleplay, certs, and QA"
      />
      <Panel>
        <PanelHeader title="Suggested updates" subtitle="Never auto-replaces approved company playbooks" />
        <div className="divide-y divide-border">
          {items.map((p) => (
            <div key={p.id} className="px-5 py-5">
              <div className="flex flex-wrap items-center gap-2">
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
                {p.evidenceCalls} analyzed calls · +{p.conversionLift}% conversion difference ·{" "}
                {p.confidence}% confidence · {p.campaigns.join(", ")}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">Source: {p.source}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setStatus(p.id, "Approved")}
                  className="rounded-lg gradient-surface px-3 py-1.5 text-xs font-semibold text-background"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(p.id, "In test")}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-secondary"
                >
                  Test
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(p.id, "Pending approval")}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-secondary"
                >
                  Edit / hold
                </button>
                <button
                  type="button"
                  onClick={() => setItems((prev) => prev.filter((x) => x.id !== p.id))}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-destructive hover:bg-secondary"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
