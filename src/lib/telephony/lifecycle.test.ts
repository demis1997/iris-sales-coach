import assert from "node:assert/strict";
import test from "node:test";
import {
  CALL_STATES,
  TERMINAL_CALL_STATES,
  canAdvanceCall,
  providerCallState,
} from "@/lib/telephony/lifecycle";
import { assertCallAccess, assertCanDial } from "@/lib/security/call-access";
import { normalizeE164 } from "@/lib/telephony/phone";
import twilio from "twilio";
import {
  recordingMediaUrl,
  validateTwilioRequest,
  verifyTelephonyPayload,
} from "@/lib/telephony/twilio.server";

test("all terminal call states reject backward and conflicting transitions", () => {
  for (const from of TERMINAL_CALL_STATES)
    for (const to of CALL_STATES) assert.equal(canAdvanceCall(from, to), from === to);
  assert.equal(canAdvanceCall("in_progress", "ringing"), false);
  assert.equal(providerCallState("no-answer"), "missed");
  assert.equal(providerCallState("canceled"), "cancelled");
  assert.throws(() => providerCallState("unexpected"));
});
test("tenant and own-call boundaries do not treat team permission as company-wide", () => {
  const ctx = { companyId: "one", userId: "a", role: "rep" as const };
  assert.doesNotThrow(() => assertCallAccess(ctx, { company_id: "one", agent_user_id: "a" }));
  assert.throws(() => assertCallAccess(ctx, { company_id: "two", agent_user_id: "a" }));
  assert.throws(() =>
    assertCallAccess({ ...ctx, role: "manager" }, { company_id: "one", agent_user_id: "b" }),
  );
  assert.throws(() => assertCanDial("viewer"));
  assert.throws(() => assertCanDial("qa"));
  assert.doesNotThrow(() => assertCanDial("rep"));
});
test("webhook signature binds public URL and form data and fails closed without credentials", () => {
  const saved = { token: process.env.TWILIO_AUTH_TOKEN, app: process.env.APP_URL };
  try {
    const token = "test-auth-token-12345678901234567890";
    process.env.TWILIO_AUTH_TOKEN = token;
    process.env.APP_URL = "https://test.example";
    const params = { CallSid: "CA" + "a".repeat(32), CallStatus: "completed" };
    const url = "https://test.example/api/twilio/status?callId=one";
    const signature = twilio.getExpectedTwilioSignature(token, url, params);
    const request = new Request("http://internal/api/twilio/status?callId=one", {
      headers: { "x-twilio-signature": signature },
    });
    assert.equal(validateTwilioRequest(request, new URLSearchParams(params)), true);
    assert.equal(
      validateTwilioRequest(request, new URLSearchParams({ ...params, CallStatus: "ringing" })),
      false,
    );
    delete process.env.TWILIO_AUTH_TOKEN;
    assert.equal(validateTwilioRequest(request, new URLSearchParams(params)), false);
    delete process.env.TELEPHONY_SIGNING_SECRET;
    assert.equal(verifyTelephonyPayload(["one"], "invalid"), false);
  } finally {
    if (saved.token === undefined) delete process.env.TWILIO_AUTH_TOKEN;
    else process.env.TWILIO_AUTH_TOKEN = saved.token;
    if (saved.app === undefined) delete process.env.APP_URL;
    else process.env.APP_URL = saved.app;
  }
});
test("recording credentials cannot follow arbitrary origins, accounts, redirects or query strings", () => {
  const account = "AC" + "a".repeat(32),
    recording = "RE" + "b".repeat(32);
  const path = `/2010-04-01/Accounts/${account}/Recordings/${recording}`;
  assert.equal(
    recordingMediaUrl("https://api.twilio.com" + path, recording, account),
    "https://api.twilio.com" + path + ".mp3",
  );
  for (const url of [
    "https://evil.example" + path,
    "http://api.twilio.com" + path,
    "https://api.twilio.com" + path + "?x=1",
    "https://user@api.twilio.com" + path,
  ])
    assert.throws(() => recordingMediaUrl(url, recording, account));
  assert.throws(() =>
    recordingMediaUrl("https://api.twilio.com" + path, "RE" + "c".repeat(32), account),
  );
  assert.throws(() => normalizeE164("<script>+1234567890</script>"));
});
