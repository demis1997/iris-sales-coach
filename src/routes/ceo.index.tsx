import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ceo/")({
  beforeLoad: () => {
    throw redirect({ to: "/app" });
  },
});
