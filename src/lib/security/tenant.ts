import type { AccessContext } from "@/lib/demo/queries";
import type { User } from "@/lib/demo/types";

/**
 * Tenant isolation helpers.
 * Organisation ID always comes from the authenticated session context — never trust client-supplied org IDs.
 */

export class TenantIsolationError extends Error {
  constructor(message = "TENANT_ISOLATION_VIOLATION") {
    super(message);
    this.name = "TenantIsolationError";
  }
}

export class ForbiddenError extends Error {
  constructor(permission: string) {
    super(`FORBIDDEN:${permission}`);
    this.name = "ForbiddenError";
  }
}

export function assertSameOrganisation(
  entityOrganisationId: string,
  sessionOrganisationId: string,
) {
  if (entityOrganisationId !== sessionOrganisationId) {
    throw new TenantIsolationError();
  }
}

export function resolveOrganisationIdFromSession(ctx: AccessContext): string {
  // Intentionally ignore any client-provided org override fields.
  return ctx.organisationId;
}

export function assertActiveUser(user: User) {
  if (user.status === "disabled") {
    throw new ForbiddenError("user:disabled");
  }
}

export function redactForLogs(value: unknown): unknown {
  if (value == null) return value;
  if (typeof value === "string") {
    return value
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
      .replace(/(api[_-]?key|secret|token|password)\s*[:=]\s*\S+/gi, "$1=[redacted]");
  }
  if (Array.isArray(value)) return value.map(redactForLogs);
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (/password|secret|token|authorization|apiKey|api_key/i.test(k)) {
        out[k] = "[redacted]";
      } else {
        out[k] = redactForLogs(v);
      }
    }
    return out;
  }
  return value;
}
