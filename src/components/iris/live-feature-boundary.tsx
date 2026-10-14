import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { CallDashboard } from "@/components/telephony/call-dashboard";
const connected = [
  "/crm/contacts",
  "/app/calls",
  "/app/dialer",
  "/app/settings",
  "/ceo/telephony",
  "/ceo/employees",
];
export function LiveFeatureBoundary({ children }: { children: ReactNode }) {
  const { demoMode } = useAuth();
  const path = useLocation().pathname.replace(/\/$/, "");
  if (demoMode)
    return (
      <>
        <p className="mb-4 rounded border border-amber-500/30 p-3 text-sm">
          Simulated workspace · sample data · no real calls or customer results
        </p>
        {children}
      </>
    );
  if (["/app", "/manager", "/ceo"].includes(path)) return <CallDashboard />;
  if (connected.some((prefix) => path === prefix || path.startsWith(prefix + "/")))
    return <>{children}</>;
  return (
    <section className="rounded-xl border border-border p-6">
      <h1 className="text-xl font-semibold">This live feature is not connected yet</h1>
      <p className="mt-3 text-muted-foreground">
        No sample performance or CRM data is presented as your organization's results. Use the calls
        workspace for actual records, or explore the labelled simulation.
      </p>
      <div className="mt-4 flex gap-5">
        <Link to="/app/calls">Open calls</Link>
        <Link to="/demo">Open simulated demo</Link>
      </div>
    </section>
  );
}
