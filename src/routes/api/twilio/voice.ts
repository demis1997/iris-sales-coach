import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/twilio/voice")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { twiml, verifyTelephonyPayload, validateTwilioRequest } = await import(
          "@/lib/telephony/twilio.server"
        );
        const url = new URL(request.url);
        const callId = url.searchParams.get("callId");
        const companyId = url.searchParams.get("companyId");
        const to = url.searchParams.get("to");
        const sig = url.searchParams.get("sig");

        const body = new URLSearchParams(await request.text());
        if (process.env.TWILIO_AUTH_TOKEN && !validateTwilioRequest(request, body)) {
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

        await admin
          .from("calls")
          .update({ status: "in_progress", updated_at: new Date().toISOString() })
          .eq("id", callId)
          .eq("company_id", companyId);

        const safeTo = to.replace(/[^\d+]/g, "");
        const announcement =
          settings?.record_calls === false
            ? "Connecting you now."
            : "Connecting you now. This call may be recorded for coaching.";

        return twiml(
          `<Say voice="Polly.Joanna">${announcement}</Say>` +
            `<Dial callerId="${callerId}" answerOnBridge="true">` +
            `<Number>${safeTo}</Number>` +
            `</Dial>`,
        );
      },
    },
  },
});
