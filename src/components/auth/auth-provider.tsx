import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { isSupabaseConfigured } from "@/integrations/supabase/config";
import {
  loadAuthSession,
  type AuthSession,
  sessionCan,
} from "@/lib/auth-session";
import type { Permission } from "@/lib/permissions";
import { workspacesForRole, roleLabel } from "@/lib/permissions";

type AuthContextValue = {
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
  /** True when Supabase env vars are missing — UI runs in local demo mode. */
  demoMode: boolean;
  refresh: () => Promise<void>;
  can: (permission: Permission) => boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const demoMode = !isSupabaseConfigured();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(!demoMode);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setSession(null);
      setLoading(false);
      setError(null);
      return;
    }
    try {
      setError(null);
      const next = await loadAuthSession();
      setSession(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load session");
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    void refresh();
    try {
      const { data: sub } = supabase.auth.onAuthStateChange(() => {
        void refresh();
      });
      return () => sub.subscription.unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Auth unavailable");
      setLoading(false);
      return;
    }
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      loading,
      error,
      demoMode,
      refresh,
      can: (permission) => {
        if (demoMode) return true;
        return sessionCan(session, permission);
      },
      signOut: async () => {
        if (!isSupabaseConfigured()) {
          setSession(null);
          return;
        }
        await supabase.auth.signOut();
        setSession(null);
      },
    }),
    [session, loading, error, demoMode, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useOptionalAuth(): AuthContextValue | null {
  return useContext(AuthContext);
}

export function useWorkspaceAccess() {
  const { session, demoMode } = useAuth();
  const role = session?.authz.role ?? (demoMode ? "owner" : null);
  return {
    role,
    roleLabel: roleLabel(role),
    workspaces: workspacesForRole(role),
    displayName: session?.fullName ?? session?.email ?? (demoMode ? "Demo user" : "User"),
    companyName: session?.membership?.companyName ?? (demoMode ? "Demo company" : null),
    needsOnboarding: Boolean(
      !demoMode && session && session.membership && !session.membership.onboardingCompletedAt,
    ),
    demoMode,
  };
}
