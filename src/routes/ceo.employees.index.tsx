import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ceo/employees/")({
  beforeLoad: () => {
    throw redirect({ to: "/app/team" });
  },
});
