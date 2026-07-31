import type { AuditLog } from "@/lib/demo/types";
import { redactForLogs } from "@/lib/security/tenant";

const MAX = 500;
let auditStore: AuditLog[] = [];

export function recordAudit(entry: Omit<AuditLog, "id" | "timestamp"> & { timestamp?: string }) {
  const row: AuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: entry.timestamp ?? new Date().toISOString(),
    organisationId: entry.organisationId,
    userId: entry.userId,
    action: entry.action,
    resource: entry.resource,
    metadata: (redactForLogs(entry.metadata ?? {}) as Record<string, unknown>) ?? {},
  };
  auditStore = [row, ...auditStore].slice(0, MAX);
  return row;
}

export function listAuditLogs(organisationId: string, userId?: string) {
  return auditStore.filter(
    (a) => a.organisationId === organisationId && (!userId || a.userId === userId),
  );
}

export function clearAuditLogsForTests() {
  auditStore = [];
}
