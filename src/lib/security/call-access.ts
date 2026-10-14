import { AuthorizationError, roleHasPermission, type AppRole } from "@/lib/permissions";

export function assertCallAccess(
  ctx: { companyId: string; userId: string; role: AppRole },
  call: { company_id: string; agent_user_id: string | null } | null,
) {
  if (!call || call.company_id !== ctx.companyId) throw new AuthorizationError("Call not found");
  // Team-scoped access requires a verified team relationship; never widen it to company-wide.
  if (call.agent_user_id !== ctx.userId && !roleHasPermission(ctx.role, "calls.view_all")) {
    throw new AuthorizationError("Cannot access this call");
  }
}

export function assertCanDial(role: AppRole) {
  if (!["owner", "admin", "rep", "manager", "team_leader", "platform_admin"].includes(role)) {
    throw new AuthorizationError("This role cannot initiate calls");
  }
}
