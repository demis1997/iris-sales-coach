import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  PhoneCall,
  Sparkles,
  LineChart,
  Target,
  Trophy,
  Settings,
} from "lucide-react";
import { AppShell, type NavItem } from "@/components/iris/app-shell";

const nav: NavItem[] = [
  { label: "Dashboard", to: "/app", icon: LayoutDashboard },
  { label: "Calls", to: "/app/calls", icon: PhoneCall },
  { label: "AI Coach", to: "/app/coach", icon: Sparkles },
  { label: "Performance", to: "/app/performance", icon: LineChart },
  { label: "Goals", to: "/app/goals", icon: Target },
  { label: "Leaderboard", to: "/app/leaderboard", icon: Trophy },
  { label: "Settings", to: "/app/settings", icon: Settings },
];

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Rep Workspace — Iris" },
      { name: "description", content: "Your calls, AI coaching, performance and goals in Iris." },
      { property: "og:title", content: "Rep Workspace — Iris" },
      { property: "og:description", content: "Your calls, AI coaching, performance and goals." },
    ],
  }),
  component: () => (
    <AppShell nav={nav} workspace="Sales rep" user={{ name: "Alex Moreau", role: "Forex Desk" }} />
  ),
});
