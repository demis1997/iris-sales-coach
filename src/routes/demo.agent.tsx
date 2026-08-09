import { createFileRoute } from "@tanstack/react-router";
import {
  Dna,
  Headphones,
  LayoutDashboard,
  MessageSquare,
  Phone,
  PhoneCall,
  Target,
} from "lucide-react";
import { DemoShell, type DemoNavItem } from "@/components/demo/demo-shell";

export const Route = createFileRoute("/demo/agent")({
  component: AgentDemoLayout,
});

const nav: DemoNavItem[] = [
  { label: "Today", to: "/demo/agent", icon: LayoutDashboard, section: "Coach" },
  { label: "Sales Workspace", to: "/demo/agent/live", icon: Phone, section: "Coach" },
  { label: "My Calls", to: "/demo/agent/calls", icon: PhoneCall, section: "Coach" },
  { label: "My Coach", to: "/demo/agent/coach", icon: MessageSquare, section: "Coach" },
  { label: "Rep DNA", to: "/demo/agent/dna", icon: Dna, section: "Growth" },
  { label: "Practice", to: "/demo/agent/practice", icon: Headphones, section: "Growth" },
  { label: "Goals", to: "/demo/agent/goals", icon: Target, section: "Growth" },
];

function AgentDemoLayout() {
  return <DemoShell role="agent" workspace="Agent Demo" nav={nav} />;
}
