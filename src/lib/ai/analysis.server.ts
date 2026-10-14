import { createClient } from "@supabase/supabase-js";
import { createLiveAIService } from "@/ai/services/ai-service";
import { toLegacyCallAnalysis } from "@/ai/adapters/to-legacy-analysis";
import { transcribeStoredCall } from "@/lib/ai/transcription.server";

export function analysisDatabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase server configuration missing");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          signal: AbortSignal.any([
            AbortSignal.timeout(30000),
            ...(init?.signal ? [init.signal] : []),
          ]),
        }),
    },
  });
}
/** Only server-authorized handlers enqueue work. This is not a public server function. */
export async function enqueueCallAnalysis(data: {
  callId: string;
  companyId: string;
  transcriptText?: string;
}) {
  const admin = analysisDatabase();
  const result = await admin.rpc("enqueue_analysis_task", {
    _company: data.companyId,
    _call: data.callId,
    _transcript: data.transcriptText ?? null,
  });
  if (result.error) throw new Error("Analysis queue unavailable");
  return { ok: true as const, queued: true as const, taskId: result.data as string };
}
/** Worker entry; all persistence is fenced and atomic in complete_analysis_task. */
export async function processAnalysisTask(task: {
  id: string;
  company_id: string;
  call_id: string;
  lease_token: string;
  transcript_text: string | null;
}) {
  if (process.env.ARTEMIS_ENABLE_PAID_AI !== "true")
    throw new Error("Paid AI processing is disabled by the operator");
  const admin = analysisDatabase();
  const { data: call, error } = await admin
    .from("calls")
    .select("contact_company,language,deleted_at")
    .eq("id", task.call_id)
    .eq("company_id", task.company_id)
    .maybeSingle();
  if (error || !call || call.deleted_at) throw new Error("Call unavailable");
  const existing = await admin
    .from("call_transcripts")
    .select("full_text, provider, model")
    .eq("call_id", task.call_id)
    .eq("company_id", task.company_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existing.error) throw new Error("Transcript lookup failed");
  const speech = task.transcript_text
    ? { text: task.transcript_text, provider: "operator", model: "manual", segments: [] }
    : existing.data?.full_text
      ? {
          text: existing.data.full_text as string,
          provider: existing.data.provider,
          model: existing.data.model,
          segments: [],
        }
      : await transcribeStoredCall(admin, task.company_id, task.call_id, call.language ?? "en");
  if (speech.text.length < 20 || speech.text.length > 120000)
    throw new Error("No usable transcript available");
  const ai = createLiveAIService();
  const metadata = { companyId: task.company_id, callId: task.call_id };
  const result = await ai.analyzeCall(
    {
      company_context: { companyId: task.company_id },
      product_context: call.contact_company ?? "unknown",
      sales_playbook: {},
      transcript: speech.text,
    },
    metadata,
  );
  const coached = await ai.coachAgent(
    {
      transcript: speech.text,
      call_analysis: result.data,
      agent_profile: {},
      company_playbook: {},
      scorecard: {},
    },
    metadata,
  );
  const analysis = toLegacyCallAnalysis(result.data, coached.data);
  const completed = await admin.rpc("complete_analysis_task", {
    _task: task.id,
    _token: task.lease_token,
    _speech: { ...speech, language: call.language ?? "en" },
    _analysis: analysis,
    _provider: result.provider,
    _model: result.model,
    _prompt: `${result.promptId}@${result.promptVersion}`,
    _input:
      result.inputTokens === null || coached.inputTokens === null
        ? null
        : result.inputTokens + coached.inputTokens,
    _output:
      result.outputTokens === null || coached.outputTokens === null
        ? null
        : result.outputTokens + coached.outputTokens,
    _cost:
      result.estimatedCost === null || coached.estimatedCost === null
        ? null
        : result.estimatedCost + coached.estimatedCost,
    _latency: result.latencyMs + coached.latencyMs,
  });
  if (completed.error || completed.data !== true)
    throw new Error("Analysis result commit rejected");
}
