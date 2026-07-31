import { createFileRoute } from "@tanstack/react-router";
import { ProductShell } from "@/components/app/shell";
import { SessionProvider } from "@/components/app/session";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Iris — Sales operating system" },
      {
        name: "description",
        content: "Overview, calls, coaching, pipeline, and revenue intelligence for your team.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppLayout,
});

function AppLayout() {
  return (
    <SessionProvider>
      <ProductShell />
      <Toaster />
    </SessionProvider>
  );
}
