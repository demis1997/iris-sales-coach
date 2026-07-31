import { createFileRoute } from "@tanstack/react-router";
import { KnowledgePage } from "@/components/app/knowledge-page";

export const Route = createFileRoute("/app/knowledge")({
  head: () => ({ meta: [{ title: "Knowledge — Iris" }, { name: "robots", content: "noindex" }] }),
  component: KnowledgePage,
});
