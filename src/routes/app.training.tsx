import { createFileRoute } from "@tanstack/react-router";
import { TrainingPage } from "@/components/app/training-page";

export const Route = createFileRoute("/app/training")({
  head: () => ({ meta: [{ title: "Training — Artemis" }, { name: "robots", content: "noindex" }] }),
  component: TrainingPage,
});
