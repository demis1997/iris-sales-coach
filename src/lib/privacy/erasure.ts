import { createHash } from "node:crypto";
import { z } from "zod";
export const erasurePlanSchema = z
  .object({
    format: z.literal("artemis/call-erasure-plan/v1"),
    companyId: z.string().uuid(),
    createdAt: z.string().datetime(),
    expiresAt: z.string().datetime(),
    tasks: z
      .array(
        z
          .object({
            task_id: z.string().uuid(),
            call_id: z.string().uuid(),
            approval_reference: z.string().min(8).max(128),
            objects: z
              .array(z.object({ id: z.string().uuid(), path: z.string().min(1).max(512) }).strict())
              .max(500),
          })
          .strict(),
      )
      .max(50),
  })
  .strict();
export type ErasurePlan = z.infer<typeof erasurePlanSchema>;
export type ErasureTask = ErasurePlan["tasks"][number];
export function planDigest(plan: ErasurePlan) {
  return createHash("sha256")
    .update(JSON.stringify(erasurePlanSchema.parse(plan)))
    .digest("hex");
}
export function validateErasurePlan(input: unknown, expectedDigest?: string, now = Date.now()) {
  const plan = erasurePlanSchema.parse(input);
  if (
    Date.parse(plan.expiresAt) <= now ||
    Date.parse(plan.createdAt) > now ||
    Date.parse(plan.expiresAt) - Date.parse(plan.createdAt) > 900000
  )
    throw new Error("Erasure plan expired or has invalid time bounds");
  if (expectedDigest && planDigest(plan) !== expectedDigest)
    throw new Error("Approved plan digest does not match");
  const tasks = new Set<string>(),
    paths = new Set<string>();
  for (const task of plan.tasks) {
    if (tasks.has(task.task_id)) throw new Error("Duplicate erasure task");
    tasks.add(task.task_id);
    for (const object of task.objects) {
      const expected = `${plan.companyId}/${task.call_id}/`;
      if (
        !object.path.startsWith(expected) ||
        object.path.split("/").length !== 3 ||
        !object.path.slice(expected.length).match(/^[A-Za-z0-9_-][A-Za-z0-9_.-]*$/) ||
        object.path.includes("..") ||
        paths.has(object.path)
      )
        throw new Error("Unsafe or duplicate recording path");
      paths.add(object.path);
    }
  }
  return plan;
}
export type ErasurePorts = {
  claim: (companyId: string, task: ErasureTask) => Promise<string | null>;
  remove: (paths: string[]) => Promise<void>;
  finish: (companyId: string, task: ErasureTask, token: string) => Promise<boolean>;
  fail: (companyId: string, task: ErasureTask, token: string) => Promise<void>;
};
/** Storage removal precedes database deletion. Partial storage success must remain retryable. */
export async function executeErasureTask(
  companyId: string,
  task: ErasureTask,
  ports: ErasurePorts,
) {
  const now = new Date();
  validateErasurePlan({
    format: "artemis/call-erasure-plan/v1",
    companyId,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 60000).toISOString(),
    tasks: [task],
  });
  const token = await ports.claim(companyId, task);
  if (!token) return { state: "not_claimed" as const };
  try {
    for (let offset = 0; offset < task.objects.length; offset += 100)
      await ports.remove(task.objects.slice(offset, offset + 100).map((object) => object.path));
    if (!(await ports.finish(companyId, task, token)))
      throw new Error("Erasure commit lost ownership");
    return { state: "completed" as const };
  } catch {
    await ports.fail(companyId, task, token);
    return { state: "retry_required" as const };
  }
}
