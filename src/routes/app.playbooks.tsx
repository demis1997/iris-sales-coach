import { createFileRoute } from "@tanstack/react-router";
import { PlaybooksPage } from "@/components/app/playbooks-page";

export const Route = createFileRoute("/app/playbooks")({
  head: () => ({ meta: [{ title: "Playbooks — Iris" }, { name: "robots", content: "noindex" }] }),
  component: PlaybooksPage,
});
