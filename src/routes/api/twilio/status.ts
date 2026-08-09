import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/twilio/status")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { verifyTelephonyPayload, validateTwilioRequest } = await import(
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

        const callStatus = (body.get("CallStatus") || "").toLowerCase();
        const duration = Number(body.get("CallDuration") || "0");
        const now = new Date().toISOString();

        let status = "in_progress";
        if (
          callStatus === "completed" ||
          callStatus === "busy" ||
          callStatus === "failed" ||
          callStatus === "no-answer" ||
          callStatus === "canceled"
        ) {
          status = callStatus === "completed" ? "completed" : "failed";
        } else if (callStatus === "ringing" || callStatus === "queued") {
          status = "ringing";
        } else if (callStatus === "in-progress") {
          status = "in_progress";
        }

        const patch: Record<string, unknown> = {
          status,
          updated_at: now,
          metadata: {
            ...(typeof call.metadata === "object" && call.metadata ? call.metadata : {}),
            last_twilio_status: callStatus,
          },
        };
        if (body.get("CallSid")) patch.external_call_id = body.get("CallSid");
        if (duration > 0) patch.duration_seconds = duration;
        if (status === "completed" || status === "failed") patch.ended_at = now;

        await admin.from("calls").update(patch).eq("id", callId);

        return new Response("ok", { status: 200 });
      },
    },
  },
});
