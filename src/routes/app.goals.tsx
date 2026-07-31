import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/goals")({
  beforeLoad: () => {
    throw redirect({ to: "/app/coaching" });
  },
});
