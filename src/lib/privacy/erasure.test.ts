import assert from "node:assert/strict";
import test from "node:test";
import {
  executeErasureTask,
  planDigest,
  validateErasurePlan,
  type ErasurePlan,
} from "./erasure.ts";
const companyId = "00000000-0000-4000-8000-000000000001",
  callId = "00000000-0000-4000-8000-000000000002";
function plan(): ErasurePlan {
  return {
    format: "artemis/call-erasure-plan/v1",
    companyId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 60000).toISOString(),
    tasks: [
      {
        task_id: callId,
        call_id: callId,
        approval_reference: "ticket-123",
        objects: [{ id: callId, path: `${companyId}/${callId}/recording.wav` }],
      },
    ],
  };
}
test("erasure approval rejects tampering, expiry, traversal and other tenants", () => {
  const p = plan();
  assert.equal(validateErasurePlan(p, planDigest(p)).companyId, companyId);
  assert.throws(() => validateErasurePlan(p, "0".repeat(64)), /digest/);
  assert.throws(() => validateErasurePlan(p, undefined, Date.now() + 120000), /expired/);
  for (const path of [
    `${companyId}/${callId}/../secret`,
    `${callId}/${callId}/recording.wav`,
    `${companyId}/${callId}/%2e%2e`,
  ]) {
    const bad = structuredClone(p);
    bad.tasks[0].objects[0].path = path;
    assert.throws(() => validateErasurePlan(bad), /Unsafe/);
  }
});
test("storage failure preserves database and schedules retry", async () => {
  const events: string[] = [];
  const result = await executeErasureTask(companyId, plan().tasks[0], {
    claim: async () => "lease",
    remove: async () => {
      events.push("storage");
      throw Error("offline");
    },
    finish: async () => {
      events.push("finish");
      return true;
    },
    fail: async () => {
      events.push("retry");
    },
  });
  assert.equal(result.state, "retry_required");
  assert.deepEqual(events, ["storage", "retry"]);
});
test("erasure requires claim and successful storage before fenced database commit", async () => {
  const events: string[] = [];
  const ports = {
    claim: async () => "lease",
    remove: async () => {
      events.push("storage");
    },
    finish: async () => {
      events.push("finish");
      return true;
    },
    fail: async () => {
      events.push("retry");
    },
  };
  assert.equal((await executeErasureTask(companyId, plan().tasks[0], ports)).state, "completed");
  assert.deepEqual(events, ["storage", "finish"]);
  events.length = 0;
  assert.equal(
    (await executeErasureTask(companyId, plan().tasks[0], { ...ports, claim: async () => null }))
      .state,
    "not_claimed",
  );
  assert.deepEqual(events, []);
});
