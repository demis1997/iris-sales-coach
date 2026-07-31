import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/coach")({
  beforeLoad: () => {
    throw redirect({ to: "/app/coaching" });
  },
});
