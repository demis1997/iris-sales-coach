import { createFileRoute } from "@tanstack/react-router";
import { CoachingPage } from "@/components/app/coaching-page";

export const Route = createFileRoute("/app/coaching")({
  head: () => ({ meta: [{ title: "Coaching — Artemis" }, { name: "robots", content: "noindex" }] }),
  component: CoachingPage,
});
