import { createFileRoute } from "@tanstack/react-router";
import { TeamPage } from "@/components/app/team-page";

export const Route = createFileRoute("/app/team")({
  head: () => ({ meta: [{ title: "Team — Artemis" }, { name: "robots", content: "noindex" }] }),
  component: TeamPage,
});
