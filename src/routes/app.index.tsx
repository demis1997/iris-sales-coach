import { createFileRoute } from "@tanstack/react-router";
import { OverviewDashboard } from "@/components/app/overview";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Overview — Iris" },
      { name: "description", content: "Revenue, pipeline risk, coaching impact, and team performance." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OverviewDashboard,
});
