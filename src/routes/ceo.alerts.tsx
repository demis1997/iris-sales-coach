import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ceo/alerts")({
  beforeLoad: () => {
    throw redirect({ to: "/app" });
  },
});
