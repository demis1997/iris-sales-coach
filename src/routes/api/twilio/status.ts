import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/twilio/status")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { verifyTelephonyPayload, validateTwilioRequest } =
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
          return new Response("Forbidden", { status: 403 });
        }

        const { getAdminClient } = await import("@/lib/telephony/session.server");
        const admin = await getAdminClient();
        const { data: call } = await admin
          .from("calls")
          .select("id, metadata")
          .eq("id", callId)
          .eq("company_id", companyId)
          .maybeSingle();

        if (!call) return new Response("Not found", { status: 404 });

        const { providerCallState } = await import("@/lib/telephony/lifecycle");
        if (
          body.get("AccountSid") !== process.env.TWILIO_ACCOUNT_SID ||
          !/^CA[a-fA-F0-9]{32}$/.test(body.get("CallSid") || "")
        )
          return new Response("Forbidden", { status: 403 });
        const sequenceText = body.get("SequenceNumber");
        const durationText = body.get("CallDuration") ?? "0";
        if (!/^\d{1,12}$/.test(sequenceText ?? "") || !/^\d{1,5}$/.test(durationText))
          return new Response("Invalid status event", { status: 400 });
        let state;
        try {
          state = providerCallState(body.get("CallStatus") ?? "");
        } catch {
          return new Response("Invalid status event", { status: 400 });
        }
        const result = await admin.rpc("apply_call_status", {
          _company: companyId,
          _call: callId,
          _sid: body.get("CallSid"),
          _sequence: Number(sequenceText),
          _state: state,
          _duration: Number(durationText),
        });
        if (result.error) return new Response("Status persistence failed", { status: 503 });

        return new Response("ok", { status: 200 });
      },
    },
  },
});
