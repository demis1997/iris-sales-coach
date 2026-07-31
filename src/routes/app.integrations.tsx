import { createFileRoute } from "@tanstack/react-router";
import { IntegrationsAppPage } from "@/components/app/integrations-page";

export const Route = createFileRoute("/app/integrations")({
  head: () => ({
    meta: [{ title: "Integrations — Iris" }, { name: "robots", content: "noindex" }],
  }),
  component: IntegrationsAppPage,
});
