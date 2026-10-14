export type CRMCapability = "contacts" | "activities" | "tasks" | "appointments";
export type CRMActivity = {
  organizationId: string;
  callId: string;
  contactExternalId?: string;
  summary: string;
  endedAt: string;
  transcriptReference?: string;
};
export type CRMJob = {
  id: string;
  organizationId: string;
  idempotencyKey: string;
  attempt: number;
  activity: CRMActivity;
};
export interface CRMAdapter {
  readonly provider: string;
  readonly capabilities: ReadonlySet<CRMCapability>;
  /** Adapter must persist or forward idempotencyKey using the provider's documented mechanism. */
  logCall(
    activity: CRMActivity,
    idempotencyKey: string,
    signal: AbortSignal,
  ): Promise<{ externalId: string }>;
}
export class CRMConfigurationError extends Error {}
export async function synchronizeCall(job: CRMJob, adapter: CRMAdapter, signal: AbortSignal) {
  if (job.activity.organizationId !== job.organizationId) throw new Error("CRM tenant mismatch");
  if (!adapter.capabilities.has("activities"))
    throw new CRMConfigurationError("Provider does not support call activity synchronization");
  if (!job.idempotencyKey || job.attempt >= 5) throw new Error("CRM retry or idempotency bounds");
  const result = await adapter.logCall(job.activity, job.idempotencyKey, signal);
  if (!result.externalId) throw new Error("CRM provider did not confirm persistence");
  return result;
}
export function fxboAdapter(): never {
  throw new CRMConfigurationError(
    "FXBO is not configured. Supply official API version/base URL, sandbox tenant/authentication, contact/activity/task/appointment endpoint schemas, idempotency semantics, webhook signature specification, rate limits and reconciliation cursors before implementing the adapter.",
  );
}
export function retryAt(attempt: number, now: number) {
  if (!Number.isInteger(attempt) || attempt < 1 || attempt >= 5) return null;
  return now + Math.min(300000, 1000 * 2 ** attempt);
}
