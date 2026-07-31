import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Users, BarChart3, Sparkles, Trophy, Bell } from "lucide-react";
import { AppShell, type NavItem } from "@/components/iris/app-shell";

const nav: NavItem[] = [
  { label: "Overview", to: "/ceo", icon: LayoutDashboard },
  { label: "Employees", to: "/ceo/employees", icon: Users },
  { label: "Comparison", to: "/ceo/comparison", icon: BarChart3 },
  { label: "AI Insights", to: "/ceo/insights", icon: Sparkles },
  { label: "Leaderboards", to: "/ceo/leaderboards", icon: Trophy },
  { label: "Alerts", to: "/ceo/alerts", icon: Bell },
];

export const Route = createFileRoute("/ceo")({
  head: () => ({
    meta: [
      { title: "Executive Dashboard — Iris" },
      { name: "description", content: "Company-wide call intelligence, revenue and team performance." },
      { property: "og:title", content: "Executive Dashboard — Iris" },
      { property: "og:description", content: "Company-wide call intelligence and team performance." },
    ],
  }),
  component: () => (
    <AppShell nav={nav} workspace="Executive" user={{ name: "Elena Kovač", role: "CEO" }} />
  ),
});
