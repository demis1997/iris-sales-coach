import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { analysisDatabase } from "../src/lib/ai/analysis.server.ts";
import {
  erasurePlanSchema,
  executeErasureTask,
  planDigest,
  validateErasurePlan,
} from "../src/lib/privacy/erasure.ts";

const args = process.argv.slice(2),
  command = args[0];
function option(name: string) {
  const index = args.indexOf(name);
  return index < 0 ? undefined : args[index + 1];
}
const admin = analysisDatabase();
if (command === "plan") {
  const company = option("--company"),
    output = option("--out");
  if (!company || !output) throw new Error("Usage: plan --company UUID --out private-plan.json");
  const result = await admin.rpc("plan_call_erasures", { _company: company });
  if (result.error) throw new Error("Erasure planning unavailable");
  const plan = erasurePlanSchema.parse({
    format: "artemis/call-erasure-plan/v1",
    companyId: company,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 900000).toISOString(),
    tasks: result.data,
  });
  validateErasurePlan(plan);
  writeFileSync(resolve(output), JSON.stringify(plan, null, 2) + "\n", { mode: 0o600, flag: "wx" });
  console.info(
    JSON.stringify({
      event: "erasure_plan_created",
      tasks: plan.tasks.length,
      sha256: planDigest(plan),
      storageDeletes: 0,
    }),
  );
} else if (command === "apply") {
  const file = option("--plan"),
    approved = option("--approved-sha256");
  if (
    process.env.ARTEMIS_ENABLE_ERASURE !== "true" ||
    !file ||
    !approved ||
    !/^[a-f0-9]{64}$/.test(approved)
  )
    throw new Error("Explicit erasure enablement and a reviewed plan SHA-256 are required");
  const plan = validateErasurePlan(JSON.parse(readFileSync(resolve(file), "utf8")), approved);
  let failures = 0;
  for (const task of plan.tasks) {
    validateErasurePlan(plan, approved);
    const result = await executeErasureTask(plan.companyId, task, {
      claim: async (company, task) => {
        const result = await admin.rpc("claim_call_erasure", {
          _company: company,
          _task: task.task_id,
          _expected: task.objects,
        });
        if (result.error) throw new Error("Claim rejected");
        return result.data as string | null;
      },
      remove: async (paths) => {
        const result = await admin.storage.from("call-recordings").remove(paths);
        if (result.error) throw new Error("Storage deletion failed");
      },
      finish: async (company, task, token) => {
        const result = await admin.rpc("finish_call_erasure", {
          _company: company,
          _task: task.task_id,
          _token: token,
          _expected: task.objects,
        });
        if (result.error) throw new Error("Commit rejected");
        return result.data === true;
      },
      fail: async (company, task, token) => {
        const result = await admin.rpc("fail_call_erasure", {
          _company: company,
          _task: task.task_id,
          _token: token,
        });
        if (result.error) throw new Error("Failure could not be recorded");
      },
    });
    if (result.state === "retry_required") failures++;
    console.info(
      JSON.stringify({ event: "erasure_task_result", taskId: task.task_id, state: result.state }),
    );
  }
  if (failures) process.exitCode = 1;
} else throw new Error("Use plan or apply. No deletion is performed by default.");
