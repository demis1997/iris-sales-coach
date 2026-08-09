import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Users, BarChart3, Sparkles, Trophy, Bell, TrendingUp, Phone } from "lucide-react";
import { AppShell, type NavItem } from "@/components/iris/app-shell";
import { RequireAuth } from "@/components/auth/require-auth";
import { useWorkspaceAccess } from "@/components/auth/auth-provider";
import { roleLabel } from "@/lib/permissions";

const nav: NavItem[] = [
  { label: "Overview", to: "/ceo", icon: LayoutDashboard, section: "Executive" },
  { label: "Revenue Intelligence", to: "/ceo/revenue", icon: TrendingUp, section: "Executive" },
  { label: "Employees", to: "/ceo/employees", icon: Users, section: "Executive" },
  { label: "Calling", to: "/ceo/telephony", icon: Phone, section: "Executive" },
  { label: "Comparison", to: "/ceo/comparison", icon: BarChart3, section: "Organizational" },
  { label: "AI Insights", to: "/ceo/insights", icon: Sparkles, section: "Organizational" },
  { label: "Leaderboards", to: "/ceo/leaderboards", icon: Trophy, section: "Organizational" },
  { label: "Alerts", to: "/ceo/alerts", icon: Bell, section: "Organizational" },
];

export const Route = createFileRoute("/ceo")({
  head: () => ({
    meta: [
      { title: "Executive Dashboard — Artemis AI" },
      { name: "description", content: "Company-wide call intelligence, revenue and team performance." },
      { property: "og:title", content: "Executive Dashboard — Artemis AI" },
      { property: "og:description", content: "Company-wide call intelligence and team performance." },
    ],
  }),
  component: CeoWorkspace,
});

function CeoWorkspace() {
  const { displayName, role } = useWorkspaceAccess();
  return (
    <RequireAuth workspace="ceo">
      <AppShell
        nav={nav}
        workspace="Executive"
        user={{ name: displayName, role: roleLabel(role) }}
      />
    </RequireAuth>
  );
}
