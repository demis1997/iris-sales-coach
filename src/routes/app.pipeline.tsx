import { createFileRoute } from "@tanstack/react-router";
import { PipelinePage } from "@/components/app/pipeline-page";

export const Route = createFileRoute("/app/pipeline")({
  head: () => ({ meta: [{ title: "Pipeline — Iris" }, { name: "robots", content: "noindex" }] }),
  component: PipelinePage,
});
