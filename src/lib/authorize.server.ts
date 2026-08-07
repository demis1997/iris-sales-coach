/**
 * Server-side authorization helpers.
 * Import only from server modules / edge functions — never ship service-role usage to the browser.
 */
import {
  authorize,
  type AuthzContext,
  type Permission,
  AuthorizationError,
  UnauthenticatedError,
} from "@/lib/permissions";

export { authorize, AuthorizationError, UnauthenticatedError };
export type { AuthzContext, Permission };

export function requirePermission(ctx: AuthzContext, permission: Permission): void {
  authorize(ctx, permission, { requireCompany: true });
}

export function buildAuthzContext(input: {
  userId: string | null | undefined;
  companyId: string | null | undefined;
  role: AuthzContext["role"];
  isMember: boolean;
}): AuthzContext {
  return {
    userId: input.userId ?? "",
    companyId: input.companyId ?? null,
    role: input.role,
    isMember: input.isMember,
  };
}
