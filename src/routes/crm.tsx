import { createFileRoute } from "@tanstack/react-router";
import { Building2, Contact, KanbanSquare, Workflow, CheckSquare, Gauge } from "lucide-react";
import { AppShell, type NavItem } from "@/components/iris/app-shell";

const nav: NavItem[] = [
  { label: "Accounts", to: "/crm", icon: Building2, section: "CRM" },
  { label: "Contacts", to: "/crm/contacts", icon: Contact, section: "CRM" },
  { label: "Pipeline", to: "/crm/pipeline", icon: KanbanSquare, section: "CRM" },
  { label: "Deal Risk", to: "/crm/deal-risk", icon: Gauge, section: "Intelligence" },
  { label: "Tasks", to: "/crm/tasks", icon: CheckSquare, section: "CRM" },
  { label: "Automations", to: "/crm/automations", icon: Workflow, section: "CRM" },
];

export const Route = createFileRoute("/crm")({
  head: () => ({
    meta: [
      { title: "CRM — Artemis AI AI Revenue OS" },
      { name: "description", content: "Accounts, contacts, pipeline, tasks and workflow automation, all fed by conversation intelligence." },
      { property: "og:title", content: "CRM — Artemis AI AI Revenue OS" },
      { property: "og:description", content: "A CRM that updates itself from every conversation." },
    ],
  }),
  component: () => (
    <AppShell nav={nav} workspace="Revenue CRM" user={{ name: "Alex Moreau", role: "Forex Desk" }} />
  ),
});
