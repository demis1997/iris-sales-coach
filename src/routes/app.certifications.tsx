import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { PageHeading, Panel, PanelHeader, Chip, Meter } from "@/components/iris/primitives";
import {
  campaignAccessRules,
  certifications,
} from "@/lib/revenue-intelligence-data";

export const Route = createFileRoute("/app/certifications")({
  head: () => ({
    meta: [
      { title: "Certifications — Artemis AI" },
      {
        name: "description",
        content: "Campaign certifications that gate dialer access until reps pass required training.",
      },
    ],
  }),
  component: CertificationsPage,
});

function CertificationsPage() {
  const [retake, setRetake] = useState<string | null>(null);

  return (
    <>
      <PageHeading
        title="Certifications & campaign access"
        subtitle="Require certification before joining a campaign — lock only that dialer, not the whole app"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {certifications.map((c) => (
          <Panel key={c.id} className="p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              <h3 className="font-semibold">{c.name}</h3>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {c.lessons} lessons · {c.roleplays} roleplays · min score {c.minScore} · expires {c.expiryDays}d
            </p>
            <p className="mt-3 text-xs">Required for: {c.requiredFor.join(", ")}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">{c.holders.length} agents certified</p>
            <Link to="/app/roleplay" className="mt-4 inline-flex text-xs text-primary hover:underline">
              Start required roleplays →
            </Link>
          </Panel>
        ))}
      </div>

      <Panel className="mt-4">
        <PanelHeader title="Campaign dialer locks" subtitle="Uncertified reps see a clear locked state" />
        <div className="divide-y divide-border">
          {campaignAccessRules.map((rule) => (
            <div key={rule.campaign} className="px-5 py-4">
              <p className="font-medium">{rule.campaign}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Requires: {rule.requireCerts.join(" · ")}
              </p>
              <div className="mt-3 space-y-3">
                {rule.lockedAgents.map((a) => (
                  <div
                    key={a.agentId}
                    className="rounded-xl border border-warning/30 bg-warning/5 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Lock className="size-4 text-warning" />
                      <span className="font-medium">{a.agent}</span>
                      <Chip tone="warn">Dialer locked for this campaign</Chip>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Missing: {a.missing.join(", ")}
                    </p>
                    <div className="mt-3 max-w-sm">
                      <div className="mb-1 flex justify-between text-[11px]">
                        <span>Progress</span>
                        <span className="font-mono">{a.progress}%</span>
                      </div>
                      <Meter value={a.progress} />
                    </div>
                    <p className="mt-2 text-xs">Next action: complete missing certification modules</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        to="/app/roleplay"
                        className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-secondary"
                      >
                        Continue training
                      </Link>
                      <button
                        type="button"
                        onClick={() => setRetake(a.agentId)}
                        className="rounded-lg gradient-surface px-3 py-1.5 text-xs font-semibold text-background"
                      >
                        Retake assessment
                      </button>
                      {retake === a.agentId ? (
                        <Chip tone="iris">Retake queued — manager notified</Chip>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
