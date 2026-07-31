import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ceo/employees/$employeeId")({
  beforeLoad: () => {
    throw redirect({ to: "/app/team" });
  },
});
