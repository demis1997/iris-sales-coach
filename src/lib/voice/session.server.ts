import { createHash, randomBytes } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { workflowSchema } from "@/lib/voice/workflow";
export async function createVoiceSession(
  admin: SupabaseClient,
  data: {
    companyId: string;
    callId: string;
    providerSid: string;
    mode: "coach" | "agent";
    workflow?: unknown;
  },
) {
  if (process.env.ARTEMIS_ENABLE_VOICE !== "true") throw new Error("Voice worker disabled");
  const url = new URL(process.env.MEDIA_STREAM_PUBLIC_URL ?? "");
  if (
    url.protocol !== "wss:" ||
    url.pathname !== "/media" ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  )
    throw new Error("Configure an authenticated public wss://host/media endpoint");
  const workflow =
    data.mode === "agent"
      ? workflowSchema.parse(data.workflow)
      : (data.workflow ?? { language: "en" });
  const token = randomBytes(32).toString("hex");
  const { error } = await admin.from("voice_sessions").insert({
    company_id: data.companyId,
    call_id: data.callId,
    provider_call_sid: data.providerSid,
    token_hash: createHash("sha256").update(token).digest("hex"),
    mode: data.mode,
    workflow,
    expires_at: new Date(Date.now() + 60000).toISOString(),
  });
  if (error) throw new Error("Voice session creation failed");
  return { url: url.href, token };
}
