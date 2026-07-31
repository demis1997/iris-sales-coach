import { createFileRoute } from "@tanstack/react-router";
import { ReportsPage } from "@/components/app/reports-page";

export const Route = createFileRoute("/app/reports")({
  head: () => ({ meta: [{ title: "Reports — Artemis" }, { name: "robots", content: "noindex" }] }),
  component: ReportsPage,
});
