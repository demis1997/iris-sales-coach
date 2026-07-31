import type { Permission } from "@/lib/demo/permissions";
import type { Role } from "@/lib/demo/types";

export type { Permission } from "@/lib/demo/permissions";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  representative: [
    "overview:own",
    "calls:own",
    "calls:detail",
    "coaching:own",
    "training:own",
    "playbooks:read",
    "knowledge:read",
    "ask_artemis",
  ],
  manager: [
    "overview:team",
    "calls:team",
    "calls:detail",
    "coaching:team",
    "team:read",
    "pipeline:team",
    "training:team",
    "playbooks:read",
    "playbooks:write",
    "knowledge:read",
    "reports:team",
    "ask_artemis",
  ],
  director: [
    "overview:org",
    "calls:org",
    "calls:detail",
    "coaching:org",
    "team:read",
    "pipeline:org",
    "training:org",
    "playbooks:read",
    "playbooks:write",
    "knowledge:read",
    "reports:org",
    "ask_artemis",
  ],
  executive: [
    "overview:org",
    "calls:org",
    "calls:detail",
    "coaching:org",
    "team:read",
    "pipeline:org",
    "training:org",
    "playbooks:read",
    "knowledge:read",
    "reports:org",
    "ask_artemis",
  ],
  admin: [
    "overview:org",
    "calls:org",
    "calls:detail",
    "coaching:org",
    "team:read",
    "pipeline:org",
    "training:org",
    "playbooks:read",
    "playbooks:write",
    "knowledge:read",
    "reports:org",
    "integrations:manage",
    "settings:org",
    "settings:security",
    "settings:billing",
    "users:manage",
    "ask_artemis",
  ],
};

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function permissionsFor(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role];
}

export function roleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    representative: "Sales Representative",
    manager: "Team Manager",
    director: "Sales Director",
    executive: "Executive",
    admin: "Organisation Administrator",
  };
  return labels[role];
}
