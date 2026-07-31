import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ORG_ID, organisation, users } from "@/lib/demo/seed";
import type { AccessContext } from "@/lib/demo/queries";
import type { DateRangeKey, Role, SessionFilters, User } from "@/lib/demo/types";
import { can } from "@/lib/demo/rbac";
import type { Permission } from "@/lib/demo/permissions";
import { loadPersistedSession, loginWithEmail, logout as authLogout } from "@/lib/auth/demo-auth";
import { assertActiveUser } from "@/lib/security/tenant";

type SessionState = {
  userId: string;
  role: Role;
  filters: SessionFilters;
  setUserId: (id: string) => void;
  setRole: (role: Role) => void;
  setDateRange: (key: DateRangeKey) => void;
  setTeamId: (teamId: string | "all") => void;
  setCustomRange: (from: string, to: string) => void;
  login: (email: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  access: AccessContext;
  user: User;
  organisationName: string;
  allowed: (permission: Permission) => boolean;
};

const SessionContext = createContext<SessionState | null>(null);

const DEFAULT_USER = "u-exec";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [userId, setUserIdState] = useState(DEFAULT_USER);
  const [roleOverride, setRoleOverride] = useState<Role | null>("executive");
  const [filters, setFilters] = useState<SessionFilters>({
    dateRange: "30d",
    teamId: "all",
  });

  useEffect(() => {
    const persisted = loadPersistedSession();
    if (persisted) {
      setUserIdState(persisted.userId);
      setRoleOverride(persisted.role);
    }
  }, []);

  const user = users.find((u) => u.id === userId) ?? users[0]!;
  const role = roleOverride ?? user.role;

  const setUserId = useCallback((id: string) => {
    const next = users.find((u) => u.id === id);
    if (!next || next.status === "disabled") return;
    setUserIdState(id);
  }, []);

  const setRole = useCallback((r: Role) => {
    setRoleOverride(r);
    const match = users.find((u) => u.role === r && u.status === "active");
    if (match) setUserIdState(match.id);
  }, []);

  const setDateRange = useCallback((key: DateRangeKey) => {
    setFilters((f) => ({ ...f, dateRange: key }));
  }, []);

  const setTeamId = useCallback((teamId: string | "all") => {
    setFilters((f) => ({ ...f, teamId }));
  }, []);

  const setCustomRange = useCallback((from: string, to: string) => {
    setFilters((f) => ({ ...f, dateRange: "custom", customFrom: from, customTo: to }));
  }, []);

  const login = useCallback((email: string) => {
    const result = loginWithEmail(email);
    if (!result.ok) return result;
    setUserIdState(result.session.userId);
    setRoleOverride(result.session.role);
    return { ok: true as const };
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUserIdState(DEFAULT_USER);
    setRoleOverride("executive");
  }, []);

  const access: AccessContext = useMemo(() => {
    try {
      assertActiveUser(user);
    } catch {
      // Fall back to executive if somehow disabled
    }
    return {
      organisationId: ORG_ID,
      user,
      role,
      filters,
    };
  }, [user, role, filters]);

  const value: SessionState = {
    userId,
    role,
    filters,
    setUserId,
    setRole,
    setDateRange,
    setTeamId,
    setCustomRange,
    login,
    logout,
    access,
    user,
    organisationName: organisation.name,
    allowed: (p) => can(role, p) && user.status !== "disabled",
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
