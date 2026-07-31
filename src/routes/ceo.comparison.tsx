import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ceo/comparison")({
  beforeLoad: () => {
    throw redirect({ to: "/app/team" });
  },
});
