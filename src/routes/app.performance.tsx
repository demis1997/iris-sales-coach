import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/performance")({
  beforeLoad: () => {
    throw redirect({ to: "/app/team" });
  },
});
