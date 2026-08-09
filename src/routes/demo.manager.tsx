import { createFileRoute } from "@tanstack/react-router";
import {
  Headphones,
  LayoutDashboard,
  PhoneCall,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { DemoShell, type DemoNavItem } from "@/components/demo/demo-shell";

export const Route = createFileRoute("/demo/manager")({
  component: ManagerDemoLayout,
});

const nav: DemoNavItem[] = [
  { label: "Overview", to: "/demo/manager", icon: LayoutDashboard, section: "Floor" },
  { label: "Live Floor", to: "/demo/manager/live", icon: Headphones, section: "Floor" },
  { label: "Team", to: "/demo/manager/team", icon: Users, section: "Floor" },
  { label: "Calls", to: "/demo/manager/calls", icon: PhoneCall, section: "Quality" },
  { label: "Coaching", to: "/demo/manager/coaching", icon: Target, section: "Quality" },
  { label: "Rep DNA", to: "/demo/ceo/agents/agt-daniel", icon: Sparkles, section: "Quality" },
  { label: "Roleplay", to: "/demo/agent/practice", icon: Headphones, section: "Quality" },
  { label: "Playbooks", to: "/demo/manager/coaching", icon: Target, section: "Quality" },
];

function ManagerDemoLayout() {
  return <DemoShell role="manager" workspace="Manager Demo" nav={nav} />;
}
