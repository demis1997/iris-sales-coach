import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Plus, Workflow, Zap } from "lucide-react";
import { PageHeading, Panel, PanelHeader, Chip } from "@/components/iris/primitives";
import { workflows } from "@/lib/revenue-os-data";

export const Route = createFileRoute("/crm/automations")({
  head: () => ({
    meta: [
      { title: "Workflow Automation — Artemis CRM" },
      { name: "description", content: "Visual automation builder: trigger on what customers say, then create tickets, notify Slack, update the CRM and send email." },
      { property: "og:title", content: "Workflow Automation — Artemis CRM" },
      { property: "og:description", content: "Turn what customers say into automatic action." },
    ],
  }),
  component: AutomationsPage,
});

function AutomationsPage() {
  const [active, setActive] = useState(workflows[0]!.name);
  const flow = workflows.find((w) => w.name === active)!;

  return (
    <>
      <PageHeading
        title="Automations"
        subtitle="Conversation triggers wired to the rest of your stack"
        action={
          <button className="flex items-center gap-1.5 rounded-xl gradient-surface px-4 py-2 text-sm font-semibold text-background">
            <Plus className="size-4" /> New workflow
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Panel>
          <PanelHeader title="Workflows" subtitle={`${workflows.length} configured`} />
          <div className="divide-y divide-border">
            {workflows.map((w) => (
              <button
                key={w.name}
                onClick={() => setActive(w.name)}
                className={`block w-full px-5 py-4 text-left transition-colors ${
                  active === w.name ? "bg-primary/5" : "hover:bg-secondary/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{w.name}</p>
                  <Chip tone={w.active ? "good" : "neutral"}>{w.active ? "Live" : "Paused"}</Chip>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{w.runs} runs this month</p>
              </button>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title={flow.name}
            subtitle={`Trigger: ${flow.trigger}`}
            action={
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Workflow className="size-3.5 text-primary" /> {flow.steps.length} steps
              </span>
            }
          />
          <div className="p-6">
            <div className="flex flex-col items-center gap-3">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md rounded-xl border border-primary/40 bg-primary/10 p-4 text-center"
              >
                <p className="flex items-center justify-center gap-1.5 text-xs text-primary">
                  <Zap className="size-3.5" /> Trigger
                </p>
                <p className="mt-1 text-sm font-medium">{flow.trigger}</p>
              </motion.div>

              {flow.steps.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * (i + 1) }}
                  className="flex w-full max-w-md flex-col items-center gap-3"
                >
                  <span className="h-5 w-px bg-border" />
                  <div className="w-full rounded-xl border border-border bg-secondary/30 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">{s}</p>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        step {i + 1}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              <span className="h-5 w-px bg-border" />
              <button className="flex items-center gap-1.5 rounded-xl border border-dashed border-border px-4 py-2.5 text-xs text-muted-foreground hover:bg-secondary">
                <Plus className="size-3.5" /> Add step
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              Connected apps:
              {["Slack", "Salesforce", "HubSpot", "Gmail", "Teams", "Zapier", "n8n"].map((a) => (
                <span key={a} className="rounded-lg border border-border px-2 py-1">
                  {a}
                </span>
              ))}
              <ArrowRight className="size-3.5" />
              <span>Webhooks &amp; API</span>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}
