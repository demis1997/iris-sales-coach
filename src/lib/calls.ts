import { supabase } from "@/integrations/supabase/client";
import { loadAuthSession } from "@/lib/auth-session";
import { processCallAnalysis } from "@/lib/ai/process-call.functions";

// Phase 2 tables may not yet be in generated Database types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

const ALLOWED_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/m4a",
  "audio/webm",
  "video/mp4",
  "video/webm",
]);

const MAX_BYTES = 100 * 1024 * 1024;

export type CallRow = {
  id: string;
  company_id: string;
  contact_name: string | null;
  contact_company: string | null;
  direction: string;
  status: string;
  outcome: string | null;
  overall_score: number | null;
  duration_seconds: number | null;
  analysis_status: string;
  transcription_status: string;
  recording_status: string;
  agent_user_id: string | null;
  created_at: string;
  started_at: string | null;
};

export async function listCalls(opts?: { agentOnly?: boolean }): Promise<CallRow[]> {
  const session = await loadAuthSession();
  if (!session?.activeCompanyId) return [];

  let query = db
    .from("calls")
    .select(
      "id, company_id, contact_name, contact_company, direction, status, outcome, overall_score, duration_seconds, analysis_status, transcription_status, recording_status, agent_user_id, created_at, started_at",
    )
    .eq("company_id", session.activeCompanyId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(100);

  if (opts?.agentOnly) {
    query = query.eq("agent_user_id", session.userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as CallRow[];
}

export async function getCallBundle(callId: string) {
  const session = await loadAuthSession();
  if (!session?.activeCompanyId) throw new Error("Not signed in");

  const { data: call, error } = await db
    .from("calls")
    .select("*")
    .eq("id", callId)
    .eq("company_id", session.activeCompanyId)
    .maybeSingle();
  if (error || !call) throw new Error("Call not found");

  const [{ data: recordings }, { data: transcript }, { data: segments }, { data: analysis }, { data: jobs }] =
    await Promise.all([
      db.from("call_recordings").select("*").eq("call_id", callId),
      db.from("call_transcripts").select("*").eq("call_id", callId).maybeSingle(),
      db.from("transcript_segments").select("*").eq("call_id", callId).order("start_ms"),
      db.from("call_ai_analyses").select("*").eq("call_id", callId).maybeSingle(),
      db.from("call_processing_jobs").select("*").eq("call_id", callId).order("created_at", { ascending: false }),
    ]);

  let signedUrl: string | null = null;
  const recording = recordings?.[0];
  if (recording?.storage_path) {
    const { data: signed } = await supabase.storage
      .from("call-recordings")
      .createSignedUrl(recording.storage_path, 60 * 30);
    signedUrl = signed?.signedUrl ?? null;
  }

  return {
    call,
    recordings: recordings ?? [],
    transcript,
    segments: segments ?? [],
    analysis,
    jobs: jobs ?? [],
    signedUrl,
  };
}

export async function uploadCallRecording(input: {
  file: File;
  contactName?: string;
  contactCompany?: string;
}): Promise<{ callId: string }> {
  const session = await loadAuthSession();
  if (!session?.activeCompanyId) throw new Error("Not signed in");

  if (!ALLOWED_TYPES.has(input.file.type) && !/\.(mp3|wav|m4a|mp4|webm)$/i.test(input.file.name)) {
    throw new Error("Unsupported file type. Use MP3, WAV, M4A, MP4, or WebM.");
  }
  if (input.file.size > MAX_BYTES) throw new Error("File too large (max 100MB).");

  const companyId = session.activeCompanyId;
  const callId = crypto.randomUUID();
  const ext = input.file.name.split(".").pop() || "mp3";
  const storagePath = `${companyId}/${callId}/${Date.now()}.${ext}`;

  const { error: callError } = await db.from("calls").insert({
    id: callId,
    company_id: companyId,
    provider: "upload",
    direction: "outbound",
    status: "uploaded",
    agent_user_id: session.userId,
    contact_name: input.contactName || input.file.name,
    contact_company: input.contactCompany || null,
    started_at: new Date().toISOString(),
    recording_status: "uploading",
    transcription_status: "pending",
    analysis_status: "pending",
  });
  if (callError) throw callError;

  const { error: uploadError } = await supabase.storage
    .from("call-recordings")
    .upload(storagePath, input.file, {
      contentType: input.file.type || "audio/mpeg",
      upsert: false,
    });

  if (uploadError) {
    await db
      .from("calls")
      .update({ recording_status: "failed", status: "failed", updated_at: new Date().toISOString() })
      .eq("id", callId);
    throw uploadError;
  }

  await db.from("call_recordings").insert({
    company_id: companyId,
    call_id: callId,
    storage_path: storagePath,
    file_name: input.file.name,
    content_type: input.file.type,
    byte_size: input.file.size,
  });

  await db.from("call_processing_jobs").insert({
    company_id: companyId,
    call_id: callId,
    stage: "uploaded",
    status: "queued",
  });

  await db
    .from("calls")
    .update({
      recording_status: "uploaded",
      status: "processing",
      updated_at: new Date().toISOString(),
    })
    .eq("id", callId);

  // Kick analysis (stub transcript if no Deepgram key on server)
  try {
    await processCallAnalysis({
      data: { callId, companyId },
    });
  } catch (err) {
    console.error("Analysis kickoff failed", err);
    await db
      .from("calls")
      .update({ analysis_status: "failed", updated_at: new Date().toISOString() })
      .eq("id", callId);
  }

  return { callId };
}

export async function getCompanyDashboardMetrics() {
  const session = await loadAuthSession();
  if (!session?.activeCompanyId) {
    return { callsCount: 0, avgScore: null, conversions: 0, recent: [] as CallRow[] };
  }

  const recent = await listCalls();
  const scored = recent.filter((c) => c.overall_score != null);
  const avgScore =
    scored.length > 0
      ? Math.round(
          (scored.reduce((sum, c) => sum + Number(c.overall_score ?? 0), 0) / scored.length) * 10,
        ) / 10
      : null;
  const conversions = recent.filter(
    (c) => c.outcome === "Closed" || /convert|won|deposit/i.test(c.outcome ?? ""),
  ).length;

  return {
    callsCount: recent.length,
    avgScore,
    conversions,
    recent: recent.slice(0, 8),
  };
}
