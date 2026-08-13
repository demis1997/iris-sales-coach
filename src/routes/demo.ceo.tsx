import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  LayoutDashboard,
  PhoneCall,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { DemoShell, type DemoNavItem } from "@/components/demo/demo-shell";

export const Route = createFileRoute("/demo/ceo")({
  component: CeoDemoLayout,
});

const nav: DemoNavItem[] = [
  { label: "Overview", to: "/demo/ceo", icon: LayoutDashboard, section: "Executive" },
  { label: "Revenue", to: "/demo/ceo/revenue", icon: TrendingUp, section: "Executive" },
  { label: "Teams", to: "/demo/ceo/teams", icon: Users, section: "Executive" },
  { label: "Agents", to: "/demo/ceo/agents", icon: Users, section: "People" },
  { label: "Calls", to: "/demo/ceo/calls", icon: PhoneCall, section: "People" },
  { label: "Opportunities", to: "/demo/ceo/opportunities", icon: Target, section: "People" },
  { label: "Insights", to: "/demo/ceo/insights", icon: Sparkles, section: "Intelligence" },
  { label: "Reports", to: "/demo/ceo/revenue", icon: BarChart3, section: "Intelligence" },
];

function CeoDemoLayout() {
  return <DemoShell role="ceo" workspace="Executive OS" nav={nav} />;
}
