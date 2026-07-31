import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy executive workspace — unified into /app with role switcher. */
export const Route = createFileRoute("/ceo")({
  beforeLoad: () => {
    throw redirect({ to: "/app" });
  },
});
