/**
 * Central permission system for Artemis AI.
 * Frontend guards are UX-only — enforce the same checks via RLS + authorize() on the server.
 */

export const PERMISSIONS = [
  "company.manage",
  "billing.manage",
  "users.manage",
  "teams.manage",
  "integrations.manage",
  "calls.view_all",
  "calls.view_team",
  "calls.view_own",
  "calls.review",
  "calls.delete",
  "analytics.company",
  "analytics.team",
  "analytics.own",
  "coaching.assign",
  "coaching.complete",
  "qa.manage",
  "playbooks.manage",
  "campaigns.manage",
  "exports.create",
  "settings.manage",
  "onboarding.manage",
  "scorecards.manage",
  "platform.admin",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export type AppRole =
  | "platform_admin"
  | "owner"
  | "admin"
  | "ceo"
  | "manager"
  | "qa"
  | "team_leader"
  | "rep"
  | "viewer"
  | "trainer";

const ALL_COMPANY: Permission[] = PERMISSIONS.filter((p) => p !== "platform.admin");

const ROLE_PERMISSIONS: Record<AppRole, readonly Permission[]> = {
  platform_admin: PERMISSIONS,
  owner: ALL_COMPANY,
  admin: ALL_COMPANY.filter((p) => p !== "billing.manage"),
  ceo: [
    "calls.view_all",
    "analytics.company",
    "analytics.team",
    "exports.create",
    "coaching.complete",
  ],
  manager: [
    "teams.manage",
    "calls.view_team",
    "calls.view_own",
    "calls.review",
    "analytics.team",
    "analytics.own",
    "coaching.assign",
    "coaching.complete",
    "qa.manage",
    "playbooks.manage",
    "campaigns.manage",
    "scorecards.manage",
    "exports.create",
  ],
  qa: [
    "calls.view_team",
    "calls.view_own",
    "calls.review",
    "analytics.team",
    "qa.manage",
    "scorecards.manage",
    "coaching.assign",
    "exports.create",
  ],
  team_leader: [
    "calls.view_team",
    "calls.view_own",
    "calls.review",
    "analytics.team",
    "analytics.own",
    "coaching.assign",
    "coaching.complete",
  ],
  trainer: [
    "calls.view_team",
    "calls.view_own",
    "analytics.team",
    "coaching.assign",
    "playbooks.manage",
    "scorecards.manage",
  ],
  rep: ["calls.view_own", "analytics.own", "coaching.complete"],
  viewer: ["analytics.company", "calls.view_all"],
};

export function permissionsForRole(role: AppRole): readonly Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function roleHasPermission(role: AppRole, permission: Permission): boolean {
  return permissionsForRole(role).includes(permission);
}

export type AuthzContext = {
  userId: string;
  companyId: string | null;
  role: AppRole | null;
  isMember: boolean;
};

export class AuthorizationError extends Error {
  readonly code = "FORBIDDEN" as const;
  readonly permission?: Permission;
  constructor(message = "You do not have permission to perform this action.", permission?: Permission) {
    super(message);
    this.name = "AuthorizationError";
    this.permission = permission;
  }
}

export class UnauthenticatedError extends Error {
  readonly code = "UNAUTHENTICATED" as const;
  constructor(message = "Authentication required.") {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

/**
 * Server-side authorization. Call from trusted server handlers / edge functions.
 * Never treat a missing check as allow.
 */
export function authorize(
  ctx: AuthzContext,
  permission: Permission,
  options?: { requireCompany?: boolean },
): void {
  if (!ctx.userId) throw new UnauthenticatedError();
  if (options?.requireCompany !== false && !ctx.companyId) {
    throw new AuthorizationError("No active company.", permission);
  }
  if (!ctx.isMember && ctx.role !== "platform_admin") {
    throw new AuthorizationError("Not a member of this company.", permission);
  }
  if (!ctx.role || !roleHasPermission(ctx.role, permission)) {
    throw new AuthorizationError(undefined, permission);
  }
}

export function can(ctx: Pick<AuthzContext, "role">, permission: Permission): boolean {
  if (!ctx.role) return false;
  return roleHasPermission(ctx.role, permission);
}

export function canAny(ctx: Pick<AuthzContext, "role">, permissions: Permission[]): boolean {
  return permissions.some((p) => can(ctx, p));
}

export function canAll(ctx: Pick<AuthzContext, "role">, permissions: Permission[]): boolean {
  return permissions.every((p) => can(ctx, p));
}

/** Workspace areas the role may open in the product shell (UX only). */
export type WorkspaceId = "app" | "manager" | "crm" | "ceo" | "admin";

export function workspacesForRole(role: AppRole | null): WorkspaceId[] {
  if (!role) return [];
  if (role === "platform_admin") return ["app", "manager", "crm", "ceo", "admin"];
  if (role === "owner" || role === "admin") return ["app", "manager", "crm", "ceo"];
  if (role === "ceo") return ["ceo", "crm"];
  if (role === "manager" || role === "qa" || role === "team_leader" || role === "trainer") {
    return ["app", "manager", "crm"];
  }
  if (role === "viewer") return ["ceo"];
  return ["app", "crm"];
}

export function roleLabel(role: AppRole | null): string {
  switch (role) {
    case "platform_admin":
      return "Platform admin";
    case "owner":
      return "Owner";
    case "admin":
      return "Admin";
    case "ceo":
      return "Executive";
    case "manager":
      return "Sales manager";
    case "qa":
      return "QA manager";
    case "team_leader":
      return "Team leader";
    case "trainer":
      return "Trainer";
    case "rep":
      return "Agent";
    case "viewer":
      return "Viewer";
    default:
      return "Member";
  }
}
