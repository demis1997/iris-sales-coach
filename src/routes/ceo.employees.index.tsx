import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeading, Panel, Chip } from "@/components/iris/primitives";
import { AuthLoading, PermissionDenied } from "@/components/auth/require-auth";
import { useAuth } from "@/components/auth/auth-provider";
import { listCompanyMembers } from "@/lib/company-members";
import { roleLabel } from "@/lib/permissions";

export const Route = createFileRoute("/ceo/employees/")({
  head: () => ({
    meta: [
      { title: "Employees — Artemis Executive" },
      { name: "description", content: "Company members from live memberships." },
      { property: "og:title", content: "Employees — Artemis Executive" },
    ],
  }),
  component: EmployeesPage,
});

function EmployeesPage() {
  const { session, loading, demoMode, can } = useAuth();
  const { data: members = [], isLoading, error, refetch } = useQuery({
    queryKey: ["company-members", session?.activeCompanyId],
    queryFn: () => listCompanyMembers(),
    enabled: Boolean(session?.activeCompanyId) && !demoMode,
  });

  if (loading) return <AuthLoading />;
  if (demoMode) {
    return (
      <>
        <PageHeading
          title="Employees"
          subtitle="Connect Supabase and invite teammates to populate this list from live memberships."
        />
        <Panel className="p-6 text-sm text-muted-foreground">
          Demo mode is active (no Supabase session). After Step 1 signup + invites, members appear here from
          `company_memberships`.
        </Panel>
      </>
    );
  }
  if (!can("analytics.company") && !can("users.manage")) {
    return <PermissionDenied message="Your role cannot view the company employee directory." />;
  }

  return (
    <>
      <PageHeading
        title="Employees"
        subtitle={
          isLoading
            ? "Loading members…"
            : `${members.length} active member${members.length === 1 ? "" : "s"} in ${session?.membership?.companyName ?? "your company"}`
        }
      />
      {error ? (
        <Panel className="mb-4 p-4 text-sm text-destructive">
          {(error as Error).message}{" "}
          <button type="button" className="underline" onClick={() => void refetch()}>
            Retry
          </button>
        </Panel>
      ) : null}
      {!isLoading && members.length === 0 ? (
        <Panel className="p-6 text-sm text-muted-foreground">
          No members yet. Invite managers and agents from onboarding or Settings.
        </Panel>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <Link key={m.userId} to="/ceo/employees/$employeeId" params={{ employeeId: m.userId }}>
              <Panel className="h-full p-5 transition-colors hover:border-primary/40">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full gradient-surface text-xs font-semibold text-background">
                    {(m.fullName ?? m.email ?? "?")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{m.fullName ?? "Unnamed"}</p>
                    <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                  </div>
                  <span className="ml-auto">
                    <Chip tone="iris">{roleLabel(m.role)}</Chip>
                  </span>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Joined {new Date(m.joinedAt).toLocaleDateString()}
                </p>
              </Panel>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
