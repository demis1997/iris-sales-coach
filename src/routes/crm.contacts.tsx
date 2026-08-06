import { createFileRoute } from "@tanstack/react-router";
import { PageHeading, Panel, Chip, Meter } from "@/components/iris/primitives";
import { crmContacts } from "@/lib/revenue-os-data";

export const Route = createFileRoute("/crm/contacts")({
  head: () => ({
    meta: [
      { title: "Contacts — Artemis CRM" },
      { name: "description", content: "Contacts with AI-detected buying intent, authority and decision-maker role." },
      { property: "og:title", content: "Contacts — Artemis CRM" },
      { property: "og:description", content: "Know who actually decides, from what they said." },
    ],
  }),
  component: ContactsPage,
});

function ContactsPage() {
  return (
    <>
      <PageHeading title="Contacts" subtitle="Buying intent and authority detected from conversations" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {crmContacts.map((c) => (
          <Panel key={c.name} className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full gradient-surface text-xs font-semibold text-background">
                {c.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{c.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {c.title} · {c.company}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted-foreground">Buying intent</span>
                <span className="font-mono">{c.intent}</span>
              </div>
              <Meter value={c.intent} />
            </div>
            <div className="mt-3">
              <Chip tone={c.role === "Decision maker" ? "good" : "iris"}>{c.role}</Chip>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
