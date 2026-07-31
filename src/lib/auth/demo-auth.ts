/**
 * Demo authentication service.
 * Production should replace this with real SSO/password/session cookies server-side.
 */

import { users, ORG_ID } from "@/lib/demo/seed";
import type { Role, User } from "@/lib/demo/types";
import { assertActiveUser } from "@/lib/security/tenant";
import { recordAudit } from "@/lib/security/audit";

const SESSION_KEY = "iris-demo-session";

export type DemoSession = {
  userId: string;
  organisationId: string;
  role: Role;
  loggedInAt: string;
};

export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function loginWithEmail(
  email: string,
): { ok: true; session: DemoSession } | { ok: false; error: string } {
  const user = findUserByEmail(email);
  if (!user) {
    return { ok: false, error: "No demo account matches that email." };
  }
  try {
    assertActiveUser(user);
  } catch {
    return { ok: false, error: "This account is disabled." };
  }

  const session: DemoSession = {
    userId: user.id,
    organisationId: user.organisationId,
    role: user.role,
    loggedInAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  recordAudit({
    organisationId: user.organisationId,
    userId: user.id,
    action: "auth.login",
    resource: "session",
    metadata: { method: "demo-email" },
  });

  return { ok: true, session };
}

export function logout() {
  if (typeof window === "undefined") return;
  const raw = window.sessionStorage.getItem(SESSION_KEY);
  if (raw) {
    try {
      const session = JSON.parse(raw) as DemoSession;
      recordAudit({
        organisationId: session.organisationId,
        userId: session.userId,
        action: "auth.logout",
        resource: "session",
        metadata: {},
      });
    } catch {
      /* ignore */
    }
  }
  window.sessionStorage.removeItem(SESSION_KEY);
}

export function loadPersistedSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as DemoSession;
    const user = users.find((u) => u.id === session.userId);
    if (!user || user.status === "disabled" || user.organisationId !== ORG_ID) return null;
    return session;
  } catch {
    return null;
  }
}

export function inviteUser(input: {
  organisationId: string;
  actorId: string;
  email: string;
  role: Role;
  name: string;
}) {
  if (input.organisationId !== ORG_ID) {
    throw new Error("TENANT_ISOLATION_VIOLATION");
  }
  recordAudit({
    organisationId: input.organisationId,
    userId: input.actorId,
    action: "user.invite",
    resource: "user",
    metadata: { email: input.email, role: input.role, name: input.name },
  });
  return {
    id: `invite-${Date.now()}`,
    email: input.email,
    role: input.role,
    status: "invited" as const,
  };
}

/** Password reset is not implemented in the demo build. */
export function requestPasswordReset(_email: string) {
  return {
    ok: false as const,
    error: "Password reset is not available in the demo. Contact sales for production auth.",
  };
}
