import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { PageHeading, Panel, Chip } from "@/components/iris/primitives";
import { crmTasks } from "@/lib/revenue-os-data";

export const Route = createFileRoute("/crm/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — Iris CRM" },
      { name: "description", content: "Follow-up tasks generated automatically from calls and workflow automations." },
      { property: "og:title", content: "Tasks — Iris CRM" },
      { property: "og:description", content: "Follow-ups written for you after every call." },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  return (
    <>
      <PageHeading title="Tasks" subtitle="Created automatically from conversations and workflows" />
      <Panel>
        <div className="divide-y divide-border">
          {crmTasks.map((t) => (
            <label
              key={t.task}
              className="flex items-center gap-3 px-5 py-4 text-sm hover:bg-secondary/30"
            >
              <input type="checkbox" className="accent-[oklch(0.66_0.2_293)]" />
              <span className="flex-1">{t.task}</span>
              <span className="text-xs text-muted-foreground">{t.due}</span>
              <Chip tone={t.source === "AI generated" ? "iris" : "neutral"}>
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="size-3" />
                  {t.source}
                </span>
              </Chip>
              <span className="grid size-6 place-items-center rounded-full bg-secondary text-[10px] font-semibold text-muted-foreground">
                {t.owner}
              </span>
            </label>
          ))}
        </div>
      </Panel>
    </>
  );
}
