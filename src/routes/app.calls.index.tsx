import { createFileRoute } from "@tanstack/react-router";
import { CallsPage } from "@/components/app/calls-page";

export const Route = createFileRoute("/app/calls/")({
  head: () => ({
    meta: [
      { title: "Calls — Artemis" },
      { name: "description", content: "Search, filter, and review analysed sales conversations." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CallsPage,
});
