import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth, useWorkspaceAccess } from "@/components/auth/auth-provider";
import type { Permission, WorkspaceId } from "@/lib/permissions";

export function AuthLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading your workspace…
      </div>
    </div>
  );
}

export function PermissionDenied({ message }: { message?: string }) {
  return (
    <div className="grid min-h-[50vh] place-items-center px-4">
      <div className="max-w-md text-center">
        <ShieldAlert className="mx-auto size-8 text-amber-500" />
        <h2 className="mt-3 text-lg font-semibold">Permission required</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {message ?? "You do not have access to this area. Ask a company admin if you need it."}
        </p>
        <Link to="/app" className="mt-4 inline-flex text-sm text-primary hover:underline">
          Back to workspace
        </Link>
      </div>
    </div>
  );
}

/** UX-only gate. Database RLS and authorize() remain the security boundary. */
export function RequireAuth({
  children,
  permission,
  workspace,
  allowIncompleteOnboarding = false,
}: {
  children: ReactNode;
  permission?: Permission;
  workspace?: WorkspaceId;
  allowIncompleteOnboarding?: boolean;
}) {
  const { session, loading, can, demoMode } = useAuth();
  const { needsOnboarding, workspaces } = useWorkspaceAccess();
  const navigate = useNavigate();

  useEffect(() => {
    if (demoMode || loading) return;
    if (!session) {
      void navigate({ to: "/auth", replace: true });
      return;
    }
    if (needsOnboarding && !allowIncompleteOnboarding) {
      void navigate({ to: "/onboarding", replace: true });
    }
  }, [demoMode, loading, session, needsOnboarding, allowIncompleteOnboarding, navigate]);

  // Local demo: Supabase not configured — keep product UI browsable.
  if (demoMode) return <>{children}</>;

  if (loading || !session) return <AuthLoading />;
  if (needsOnboarding && !allowIncompleteOnboarding) return <AuthLoading />;

  if (workspace && !workspaces.includes(workspace)) {
    return (
      <PermissionDenied message="Your role cannot open this workspace. Use the workspace switcher if you have access elsewhere." />
    );
  }

  if (permission && !can(permission)) {
    return <PermissionDenied />;
  }

  return <>{children}</>;
}
