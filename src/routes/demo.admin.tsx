import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Building2,
  GitBranch,
  LayoutDashboard,
  ListOrdered,
  Phone,
  Settings,
  Shield,
  Users,
  Wallet,
  Workflow,
} from "lucide-react";
import { DemoShell, type DemoNavItem } from "@/components/demo/demo-shell";

export const Route = createFileRoute("/demo/admin")({
  component: AdminLayout,
});

const nav: DemoNavItem[] = [
  { label: "Overview", to: "/demo/admin", icon: LayoutDashboard, section: "Control" },
  { label: "Users", to: "/demo/admin/users", icon: Users, section: "Control" },
  { label: "Teams", to: "/demo/admin/teams", icon: Building2, section: "Control" },
  { label: "Phone Numbers", to: "/demo/admin/numbers", icon: Phone, section: "Voice" },
  { label: "Call Routing", to: "/demo/admin/routing", icon: GitBranch, section: "Voice" },
  { label: "Campaigns", to: "/demo/admin/campaigns", icon: ListOrdered, section: "Sales" },
  { label: "Integrations", to: "/demo/admin/integrations", icon: Workflow, section: "Platform" },
  { label: "AI Playbooks", to: "/demo/admin/playbooks", icon: BookOpen, section: "Platform" },
  { label: "Compliance", to: "/demo/admin/compliance", icon: Shield, section: "Platform" },
  { label: "Billing", to: "/demo/admin/billing", icon: Wallet, section: "Platform" },
  { label: "Settings", to: "/demo/admin/settings", icon: Settings, section: "Platform" },
];

function AdminLayout() {
  return <DemoShell role="admin" workspace="Admin Console" nav={nav} />;
}
