import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/app/settings-page";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — Artemis" }, { name: "robots", content: "noindex" }] }),
  component: SettingsPage,
});
