import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/api/twilio/inbound")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { validateTwilioRequest, twiml } = await import("@/lib/telephony/twilio.server");
        const { readTwilioForm } = await import("@/lib/telephony/twilio.server");
        const body = await readTwilioForm(request);
        if (
          !validateTwilioRequest(request, body) ||
          body.get("AccountSid") !== process.env.TWILIO_ACCOUNT_SID
        )
          return new Response("Forbidden", { status: 403 });
        if (
          process.env.ARTEMIS_ENABLE_REAL_CALLS !== "true" ||
          process.env.ARTEMIS_ENABLE_VOICE !== "true" ||
          process.env.ARTEMIS_ENABLE_PAID_AI !== "true"
        )
          return twiml('<Reject reason="busy"/>');
        const { getAdminClient } = await import("@/lib/telephony/session.server");
        const { normalizeE164 } = await import("@/lib/telephony/phone");
        const { createVoiceSession } = await import("@/lib/voice/session.server");
        const { workflowSchema } = await import("@/lib/voice/workflow");
        const { default: twilio } = await import("twilio");
        const sid = body.get("CallSid") ?? "";
        if (!/^CA[a-fA-F0-9]{32}$/.test(sid)) return new Response("Invalid call", { status: 400 });
        const admin = await getAdminClient();
        const settings = await admin
          .from("company_telephony_settings")
          .select("company_id")
          .eq("caller_id_e164", body.get("To"))
          .eq("enabled", true)
          .maybeSingle();
        if (settings.error || !settings.data) return twiml('<Reject reason="busy"/>');
        const companyId = settings.data.company_id;
        const workflowResult = await admin
          .from("voice_workflows")
          .select("configuration")
          .eq("company_id", companyId)
          .eq("enabled", true)
          .maybeSingle();
        const parsed = workflowSchema.safeParse(workflowResult.data?.configuration);
        if (workflowResult.error || !parsed.success) return twiml('<Reject reason="busy"/>');
        let from;
        try {
          from = normalizeE164(body.get("From") ?? "");
        } catch {
          return twiml('<Reject reason="rejected"/>');
        }
        const existing = await admin
          .from("calls")
          .select("id")
          .eq("company_id", companyId)
          .eq("provider", "twilio")
          .eq("external_call_id", sid)
          .maybeSingle();
        if (existing.error) return new Response("Call lookup unavailable", { status: 503 });
        let callId = existing.data?.id;
        if (!callId) {
          callId = crypto.randomUUID();
          const inserted = await admin.from("calls").insert({
            id: callId,
            company_id: companyId,
            external_call_id: sid,
            provider: "twilio",
            direction: "inbound",
            status: "in_progress",
            phone_number: from,
            contact_name: from,
            recording_status: "skipped",
            consent_status: "inbound_ai_disclosed",
            started_at: new Date().toISOString(),
          });
          if (inserted.error) return new Response("Call reservation unavailable", { status: 503 });
        }
        const session = await createVoiceSession(admin, {
          companyId,
          callId,
          providerSid: sid,
          mode: "agent",
          workflow: parsed.data,
        });
        const response = new twilio.twiml.VoiceResponse();
        response.say(
          {
            voice: parsed.data.language === "ru" ? "Polly.Tatyana" : "Polly.Joanna",
            language: parsed.data.language === "ru" ? "ru-RU" : "en-US",
          },
          parsed.data.disclosure,
        );
        response
          .connect()
          .stream({ url: session.url })
          .parameter({ name: "token", value: session.token });
        response.say("The AI connection ended. Connecting you to a human agent.");
        response.dial().number(parsed.data.humanHandoffNumber);
        return new Response(response.toString(), {
          headers: { "Content-Type": "text/xml; charset=utf-8" },
        });
      },
    },
  },
});
