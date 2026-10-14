import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        const { configurationStatus } = await import("@/lib/security/production-config");
        const status = configurationStatus(process.env);
        return Response.json(status, {
          status: status.configured ? 200 : 503,
          headers: { "Cache-Control": "no-store" },
        });
      },
    },
  },
});
