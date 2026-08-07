import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  PhoneCall,
  Sparkles,
  LineChart,
  Target,
  Trophy,
  Settings,
  Headphones,
  Dna,
  Bot,
  BookOpen,
  BadgeCheck,
  Brain,
} from "lucide-react";
import { AppShell, type NavItem } from "@/components/iris/app-shell";
import { RequireAuth } from "@/components/auth/require-auth";
import { useWorkspaceAccess } from "@/components/auth/auth-provider";
import { roleLabel } from "@/lib/permissions";

const nav: NavItem[] = [
  { label: "Dashboard", to: "/app", icon: LayoutDashboard, section: "Workspace" },
  { label: "Dialer / Live Coach", to: "/app/dialer", icon: Headphones, section: "AI Workspace" },
  { label: "Calls & analysis", to: "/app/calls", icon: PhoneCall, section: "AI Workspace" },
  { label: "Knowledge Base", to: "/app/knowledge", icon: BookOpen, section: "AI Workspace" },
  { label: "Revenue DNA", to: "/app/dna", icon: Dna, section: "Performance" },
  { label: "Coaching Plans", to: "/app/coach", icon: Sparkles, section: "Performance" },
  { label: "Certifications", to: "/app/certifications", icon: BadgeCheck, section: "Performance" },
  { label: "Leaderboard", to: "/app/leaderboard", icon: Trophy, section: "Performance" },
  { label: "AI Roleplay", to: "/app/roleplay", icon: Bot, section: "Training" },
  { label: "Performance", to: "/app/performance", icon: LineChart, section: "Training" },
  { label: "Goals", to: "/app/goals", icon: Target, section: "Training" },
  { label: "AI Insights", to: "/app/coach", icon: Brain, section: "Intelligence" },
  { label: "Settings", to: "/app/settings", icon: Settings, section: "Admin" },
];

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Rep Workspace — Artemis AI" },
      { name: "description", content: "Your calls, AI coaching, performance and goals in Artemis AI." },
      { property: "og:title", content: "Rep Workspace — Artemis AI" },
      { property: "og:description", content: "Your calls, AI coaching, performance and goals." },
    ],
  }),
  component: AppWorkspace,
});

function AppWorkspace() {
  const { displayName, role } = useWorkspaceAccess();
  return (
    <RequireAuth workspace="app">
      <AppShell
        nav={nav}
        workspace="Sales rep"
        user={{ name: displayName, role: roleLabel(role) }}
      />
    </RequireAuth>
  );
}
