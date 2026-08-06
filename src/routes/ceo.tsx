import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Users, BarChart3, Sparkles, Trophy, Bell, TrendingUp } from "lucide-react";
import { AppShell, type NavItem } from "@/components/iris/app-shell";

const nav: NavItem[] = [
  { label: "Overview", to: "/ceo", icon: LayoutDashboard, section: "Executive" },
  { label: "Revenue Intelligence", to: "/ceo/revenue", icon: TrendingUp, section: "Executive" },
  { label: "Employees", to: "/ceo/employees", icon: Users, section: "Executive" },
  { label: "Comparison", to: "/ceo/comparison", icon: BarChart3, section: "Organizational" },
  { label: "AI Insights", to: "/ceo/insights", icon: Sparkles, section: "Organizational" },
  { label: "Leaderboards", to: "/ceo/leaderboards", icon: Trophy, section: "Organizational" },
  { label: "Alerts", to: "/ceo/alerts", icon: Bell, section: "Organizational" },
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
