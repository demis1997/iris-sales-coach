import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ceo/insights")({
  beforeLoad: () => {
    throw redirect({ to: "/app/reports" });
  },
});
