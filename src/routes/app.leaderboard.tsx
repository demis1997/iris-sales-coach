import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/leaderboard")({
  beforeLoad: () => {
    throw redirect({ to: "/app/team" });
  },
});
