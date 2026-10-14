import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/twilio/voice")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { twiml, verifyTelephonyPayload, validateTwilioRequest } =
          await import("@/lib/telephony/twilio.server");
        const url = new URL(request.url);
        const callId = url.searchParams.get("callId");
        const companyId = url.searchParams.get("companyId");
        const to = url.searchParams.get("to");
        const sig = url.searchParams.get("sig");

        const { readTwilioForm } = await import("@/lib/telephony/twilio.server");
        const body = await readTwilioForm(request);
        if (!validateTwilioRequest(request, body)) {
          return new Response("Forbidden", { status: 403 });
        }

        if (!callId || !companyId || !to || !verifyTelephonyPayload([callId, companyId, to], sig)) {
          return twiml("<Say>This call link is invalid.</Say><Hangup/>");
        }

        const { getAdminClient } = await import("@/lib/telephony/session.server");
        const admin = await getAdminClient();
        const { data: settings } = await admin
          .from("company_telephony_settings")
          .select("caller_id_e164, record_calls")
          .eq("company_id", companyId)
          .maybeSingle();

        const { defaultPlatformCallerId } = await import("@/lib/telephony/twilio.server");
        const callerId = settings?.caller_id_e164 || defaultPlatformCallerId();
        if (!callerId) {
          return twiml("<Say>Company caller ID is not configured.</Say><Hangup/>");
        }

        const { data: call, error } = await admin
          .from("calls")
          .select("id, phone_number, external_call_id, status, language")
          .eq("id", callId)
          .eq("company_id", companyId)
          .maybeSingle();
        if (
          error ||
          !call ||
          call.phone_number !== to ||
          (call.external_call_id && call.external_call_id !== body.get("CallSid")) ||
          !["created", "ringing", "in_progress", "provider_unknown"].includes(call.status)
        )
          return twiml("<Hangup/>");
        if (body.get("AccountSid") !== process.env.TWILIO_ACCOUNT_SID)
          return new Response("Forbidden", { status: 403 });
        if (!/^\+[1-9]\d{7,14}$/.test(callerId)) return twiml("<Hangup/>");
        const suppressed = await admin
          .from("contact_suppressions")
          .select("phone_e164")
          .eq("company_id", companyId)
          .eq("phone_e164", to)
          .maybeSingle();
        if (suppressed.error || suppressed.data) return twiml("<Hangup/>");

        const { default: twilio } = await import("twilio");
        const response = new twilio.twiml.VoiceResponse();
        if (process.env.ARTEMIS_ENABLE_VOICE === "true") {
          const { createVoiceSession } = await import("@/lib/voice/session.server");
          const session = await createVoiceSession(admin, {
            companyId,
            callId,
            providerSid: body.get("CallSid") || "",
            mode: "coach",
            workflow: { language: call.language === "ru" ? "ru" : "en" },
          });
          const stream = response.start().stream({ url: session.url, track: "both_tracks" });
          stream.parameter({ name: "token", value: session.token });
        }
        response.say({ voice: "Polly.Joanna" }, "Connecting you now.");
        response.dial({ callerId, answerOnBridge: true, timeout: 30 }).number(to);
        return new Response(response.toString(), {
          headers: { "Content-Type": "text/xml; charset=utf-8" },
        });
      },
    },
  },
});
