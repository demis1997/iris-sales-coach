import test from "node:test";
import assert from "node:assert/strict";
import { fxboAdapter, retryAt, synchronizeCall, type CRMAdapter } from "@/lib/crm/adapter";
test("CRM adapter forwards idempotency and blocks cross-tenant or unsupported jobs", async () => {
  let calls = 0;
  const adapter: CRMAdapter = {
    provider: "test-double",
    capabilities: new Set(["activities"]),
    logCall: async (activity, key) => {
      calls++;
      assert.equal(key, "stable");
      return { externalId: "activity-1" };
    },
  };
  const job = {
    id: "job",
    organizationId: "one",
    idempotencyKey: "stable",
    attempt: 1,
    activity: {
      organizationId: "one",
      callId: "call",
      summary: "Actual call summary",
      endedAt: new Date().toISOString(),
    },
  };
  assert.equal(
    (await synchronizeCall(job, adapter, new AbortController().signal)).externalId,
    "activity-1",
  );
  await assert.rejects(
    () => synchronizeCall({ ...job, organizationId: "two" }, adapter, new AbortController().signal),
    /tenant/,
  );
  assert.equal(calls, 1);
  assert.equal(retryAt(5, 0), null);
  assert.ok(retryAt(1, 0)! > 0);
  assert.throws(fxboAdapter, /official API/);
});
