import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/twilio/recording")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { verifyTelephonyPayload, validateTwilioRequest } =
          await import("@/lib/telephony/twilio.server");
        const url = new URL(request.url);
        const callId = url.searchParams.get("callId");
        const companyId = url.searchParams.get("companyId");
        const sig = url.searchParams.get("sig");

        const { readTwilioForm } = await import("@/lib/telephony/twilio.server");
        const body = await readTwilioForm(request);
        if (!validateTwilioRequest(request, body)) {
          return new Response("Forbidden", { status: 403 });
        }

        if (!callId || !companyId || !sig) {
          return new Response("Bad Request", { status: 400 });
        }

        const { getAdminClient } = await import("@/lib/telephony/session.server");
        const admin = await getAdminClient();
        const { data: call } = await admin
          .from("calls")
          .select("id, phone_number, external_call_id, recording_status")
          .eq("id", callId)
          .eq("company_id", companyId)
          .is("deleted_at", null)
          .maybeSingle();

        if (!call?.phone_number) return new Response("Not found", { status: 404 });
        if (!verifyTelephonyPayload([callId, companyId, call.phone_number], sig)) {
          return new Response("Forbidden", { status: 403 });
        }

        if (
          body.get("AccountSid") !== process.env.TWILIO_ACCOUNT_SID ||
          body.get("CallSid") !== call.external_call_id
        )
          return new Response("Forbidden", { status: 403 });
        if (body.get("RecordingStatus") !== "completed") return new Response("ok", { status: 200 });
        if (!["pending", "uploaded"].includes(call.recording_status))
          return new Response("Recording consent not established", { status: 403 });
        if (call.recording_status === "uploaded") return new Response("ok", { status: 200 });
        const recordingUrl = body.get("RecordingUrl");
        const recordingSid = body.get("RecordingSid");
        const duration = Number(body.get("RecordingDuration") || "0");
        if (!recordingUrl) return new Response("No recording", { status: 200 });

        const accountSid = process.env.TWILIO_ACCOUNT_SID!;
        const authToken = process.env.TWILIO_AUTH_TOKEN!;
        const { recordingMediaUrl } = await import("@/lib/telephony/twilio.server");
        const mediaUrl = recordingMediaUrl(recordingUrl, recordingSid || "", accountSid);
        const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
        const mediaRes = await fetch(mediaUrl, {
          headers: { Authorization: `Basic ${auth}` },
          redirect: "error",
          signal: AbortSignal.timeout(30000),
        });
        if (!mediaRes.ok) {
          await admin
            .from("calls")
            .update({ recording_status: "failed", updated_at: new Date().toISOString() })
            .eq("id", callId);
          return new Response("download failed", { status: 502 });
        }

        const { readBounded } = await import("@/lib/providers/http.server");
        const bytes = await readBounded(mediaRes, 100 * 1024 * 1024);
        const storagePath = `${companyId}/${callId}/${recordingSid || Date.now()}.mp3`;

        const { error: uploadError } = await admin.storage
          .from("call-recordings")
          .upload(storagePath, bytes, {
            contentType: "audio/mpeg",
            upsert: true,
          });

        if (uploadError) {
          await admin
            .from("calls")
            .update({ recording_status: "failed", updated_at: new Date().toISOString() })
            .eq("id", callId);
          return new Response("upload failed", { status: 500 });
        }

        await admin.from("call_recordings").insert({
          company_id: companyId,
          call_id: callId,
          storage_path: storagePath,
          file_name: `${recordingSid || callId}.mp3`,
          content_type: "audio/mpeg",
          byte_size: bytes.byteLength,
          duration_seconds: duration > 0 ? duration : null,
        });

        await admin.from("call_processing_jobs").insert({
          company_id: companyId,
          call_id: callId,
          stage: "uploaded",
          status: "queued",
          provider: "twilio",
        });

        await admin
          .from("calls")
          .update({
            recording_status: "uploaded",
            status: "processing",
            duration_seconds: duration > 0 ? duration : undefined,
            ended_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", callId);

        try {
          const { enqueueCallAnalysis } = await import("@/lib/ai/analysis.server");
          await enqueueCallAnalysis({ callId, companyId });
        } catch (err) {
          console.error(JSON.stringify({ event: "recording_analysis_failed", callId }));
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
