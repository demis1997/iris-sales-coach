import { createFileRoute } from "@tanstack/react-router";
import { Activity, BookOpen, ShieldCheck, Users, Grid3X3 } from "lucide-react";
import { AppShell, type NavItem } from "@/components/iris/app-shell";

const nav: NavItem[] = [
  { label: "Live floor", to: "/manager", icon: Activity, section: "Manager" },
  { label: "QA Workspace", to: "/manager/qa", icon: ShieldCheck, section: "Manager" },
  { label: "Coaching", to: "/manager/coaching", icon: Users, section: "Manager" },
  { label: "Team Skills", to: "/manager/qa", icon: Grid3X3, section: "Manager" },
  { label: "Playbook Intel", to: "/manager/playbooks", icon: BookOpen, section: "Intelligence" },
];

export const Route = createFileRoute("/manager")({
  head: () => ({
    meta: [
      { title: "Manager Workspace — Artemis AI AI" },
      { name: "description", content: "Live team activity, coaching assignments and QA review for sales managers." },
      { property: "og:title", content: "Manager Workspace — Artemis AI AI" },
      { property: "og:description", content: "Coach the floor in real time." },
    ],
  }),
  component: () => (
    <AppShell nav={nav} workspace="Manager" user={{ name: "Sofia Rahman", role: "Sales Manager" }} />
  ),
});
