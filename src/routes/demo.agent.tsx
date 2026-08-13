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
  { label: "Today", to: "/demo/agent", icon: LayoutDashboard, section: "Workspace" },
  { label: "Leads", to: "/demo/agent/leads", icon: Target, section: "Workspace" },
  { label: "Dialer", to: "/demo/agent/live", icon: Phone, section: "Workspace" },
  { label: "Calls", to: "/demo/agent/calls", icon: PhoneCall, section: "Workspace" },
  { label: "Coaching", to: "/demo/agent/coach", icon: MessageSquare, section: "Improve" },
  { label: "Roleplay", to: "/demo/agent/practice", icon: Headphones, section: "Improve" },
  { label: "Performance", to: "/demo/agent/dna", icon: Dna, section: "Improve" },
  { label: "Goals", to: "/demo/agent/goals", icon: Target, section: "Improve" },
];

function AgentDemoLayout() {
  return <DemoShell role="agent" workspace="Agent Workspace" nav={nav} />;
}
