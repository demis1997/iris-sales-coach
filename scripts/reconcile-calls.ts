import { analysisDatabase } from "../src/lib/ai/analysis.server.ts";
import { getTwilioClient } from "../src/lib/telephony/twilio.server.ts";
import { providerCallState } from "../src/lib/telephony/lifecycle.ts";
import { setTimeout as wait } from "node:timers/promises";
if (process.env.ARTEMIS_ENABLE_REAL_CALLS !== "true")
  throw new Error("Real telephony must be explicitly enabled");
const admin = analysisDatabase();
const client = getTwilioClient();
let stopping = false;
process.on("SIGTERM", () => {
  stopping = true;
});
process.on("SIGINT", () => {
  stopping = true;
});
while (!stopping) {
  const calls = await admin
    .from("calls")
    .select("id,company_id,external_call_id")
    .eq("provider", "twilio")
    .is("deleted_at", null)
    .in("status", ["created", "ringing", "in_progress", "provider_unknown"])
    .not("external_call_id", "is", null)
    .lt("updated_at", new Date(Date.now() - 15000).toISOString())
    .order("updated_at")
    .limit(50);
  if (calls.error) console.error(JSON.stringify({ event: "call_reconciliation_query_failed" }));
  for (const call of calls.data ?? []) {
    if (stopping) break;
    try {
      const observed = await client.calls(call.external_call_id).fetch();
      const result = await admin.rpc("apply_call_status", {
        _company: call.company_id,
        _call: call.id,
        _sid: observed.sid,
        _sequence: null,
        _state: providerCallState(observed.status),
        _duration: Number(observed.duration || 0),
      });
      if (result.error) throw new Error("Status commit failed");
    } catch {
      console.error(JSON.stringify({ event: "call_reconciliation_failed", callId: call.id }));
    }
  }
  await wait(5000);
}
