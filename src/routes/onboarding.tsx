import { createFileRoute } from "@tanstack/react-router";
import { OnboardingWizard } from "@/components/app/onboarding-wizard";
import { SessionProvider } from "@/components/app/session";
import { Toaster } from "@/components/ui/sonner";
import { IrisMark } from "@/components/iris/app-shell";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding — Iris" },
      {
        name: "description",
        content:
          "Guided organisation setup: teams, call source, CRM, scorecard, and first call insight.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OnboardingRoute,
});

function OnboardingRoute() {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border px-4 py-3">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <IrisMark className="size-7" />
              <span className="font-semibold tracking-tight">Iris</span>
            </Link>
            <Link to="/app" className="text-sm text-muted-foreground hover:text-foreground">
              Skip to product
            </Link>
          </div>
        </header>
        <main className="px-4 py-8">
          <OnboardingWizard />
        </main>
        <Toaster />
      </div>
    </SessionProvider>
  );
}
