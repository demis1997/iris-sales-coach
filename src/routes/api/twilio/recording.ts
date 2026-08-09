import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/twilio/recording")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { verifyTelephonyPayload, validateTwilioRequest } = await import(
          "@/lib/telephony/twilio.server"
        );
        const url = new URL(request.url);
        const callId = url.searchParams.get("callId");
        const companyId = url.searchParams.get("companyId");
        const sig = url.searchParams.get("sig");

        const body = new URLSearchParams(await request.text());
        if (process.env.TWILIO_AUTH_TOKEN && !validateTwilioRequest(request, body)) {
          return new Response("Forbidden", { status: 403 });
        }

        if (!callId || !companyId || !sig) {
          return new Response("Bad Request", { status: 400 });
        }

        const { getAdminClient } = await import("@/lib/telephony/session.server");
        const admin = await getAdminClient();
        const { data: call } = await admin
          .from("calls")
          .select("id, phone_number")
          .eq("id", callId)
          .eq("company_id", companyId)
          .maybeSingle();

        if (!call?.phone_number) return new Response("Not found", { status: 404 });
        if (!verifyTelephonyPayload([callId, companyId, call.phone_number], sig)) {
          return new Response("Forbidden", { status: 403 });
        }

        const recordingUrl = body.get("RecordingUrl");
        const recordingSid = body.get("RecordingSid");
        const duration = Number(body.get("RecordingDuration") || "0");
        if (!recordingUrl) return new Response("No recording", { status: 200 });

        const accountSid = process.env.TWILIO_ACCOUNT_SID!;
        const authToken = process.env.TWILIO_AUTH_TOKEN!;
        const mediaUrl = `${recordingUrl}.mp3`;
        const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
        const mediaRes = await fetch(mediaUrl, {
          headers: { Authorization: `Basic ${auth}` },
        });
        if (!mediaRes.ok) {
          await admin
            .from("calls")
            .update({ recording_status: "failed", updated_at: new Date().toISOString() })
            .eq("id", callId);
          return new Response("download failed", { status: 502 });
        }

        const bytes = Buffer.from(await mediaRes.arrayBuffer());
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
          const { processCallAnalysis } = await import("@/lib/ai/process-call.functions");
          await processCallAnalysis({ data: { callId, companyId } });
        } catch (err) {
          console.error("[twilio/recording] analysis kickoff failed", err);
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
