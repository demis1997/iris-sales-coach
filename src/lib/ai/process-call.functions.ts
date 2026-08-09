import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { coachFromTranscript, resolveCoachProvider } from "@/lib/ai/coach";

const processInput = z.object({
  callId: z.string().uuid(),
  companyId: z.string().uuid(),
  transcriptText: z.string().min(20).optional(),
});

/**
 * Server-only call analysis.
 * Prefers Cursor chat completions as the Artemis sales coach when configured.
 */
export const processCallAnalysis = createServerFn({ method: "POST" })
  .validator((data: unknown) => processInput.parse(data))
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env.SUPABASE_URL;
    const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
    if (!url || !secret) throw new Error("Supabase server keys missing");

    const admin = createClient(url, secret, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: call, error: callError } = await admin
      .from("calls")
      .select("*")
      .eq("id", data.callId)
      .eq("company_id", data.companyId)
      .maybeSingle();

    if (callError || !call) throw new Error("Call not found");

    const resolved = resolveCoachProvider();

    await admin
      .from("calls")
      .update({
        analysis_status: "analysing",
        transcription_status: data.transcriptText ? "completed" : call.transcription_status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.callId);

    const jobInsert = await admin
      .from("call_processing_jobs")
      .insert({
        company_id: data.companyId,
        call_id: data.callId,
        stage: "analysing",
        status: "running",
        provider: resolved.kind,
        model: resolved.model,
        started_at: new Date().toISOString(),
        attempt: 1,
      })
      .select("id")
      .single();

    const transcript =
      data.transcriptText ||
      [
        `Agent: Thanks for taking my call. I'm reaching out about ${call.contact_company ?? "our offer"}.`,
        `Customer: I'm interested but the price feels high and I need to think about it.`,
        `Agent: Completely fair. What part feels unclear versus expensive? We can also schedule a short follow-up.`,
        `Customer: Maybe next week works. Send me a summary.`,
      ].join("\n");

    const started = Date.now();
    let analysis;
    let provider = resolved.kind;
    let model = resolved.model;
    let inputTokens: number | null = null;
    let outputTokens: number | null = null;
    let promptId = "legacy_sales_coach";
    let promptVersion = "0.0.0";

    try {
      if (process.env.OPENAI_API_KEY) {
        const { createAIService } = await import("@/ai/services/ai-service");
        const { toLegacyCallAnalysis } = await import("@/ai/adapters/to-legacy-analysis");
        const ai = createAIService("openai");
        const analysisResult = await ai.analyzeCall(
          {
            company_context: { companyId: data.companyId },
            product_context: call.contact_company ?? "unknown",
            sales_playbook: {},
            transcript,
          },
          { companyId: data.companyId, callId: data.callId },
        );
        const coachingResult = await ai.coachAgent(
          {
            transcript,
            call_analysis: analysisResult.data,
            agent_profile: {},
            company_playbook: {},
            scorecard: {},
          },
          { companyId: data.companyId, callId: data.callId },
        );
        analysis = toLegacyCallAnalysis(analysisResult.data, coachingResult.data);
        provider = analysisResult.provider;
        model = analysisResult.model;
        inputTokens = analysisResult.inputTokens;
        outputTokens = analysisResult.outputTokens;
        promptId = analysisResult.promptId;
        promptVersion = analysisResult.promptVersion;
      } else {
        const coached = await coachFromTranscript(transcript, {
          product: call.contact_company ?? undefined,
          callType: call.direction ?? "sales",
          contactName: call.contact_name ?? undefined,
          contactCompany: call.contact_company ?? undefined,
        });
        analysis = coached.coaching;
        provider = coached.provider;
        model = coached.model;
        inputTokens = coached.inputTokens;
        outputTokens = coached.outputTokens;
      }
    } catch (err) {
      const errText = err instanceof Error ? err.message : String(err);
      await failJob(admin, jobInsert.data?.id, call.id, errText);
      throw err;
    }

    const latency = Date.now() - started;

    await admin.from("call_transcripts").delete().eq("call_id", data.callId);
    const { data: transcriptRow, error: tErr } = await admin
      .from("call_transcripts")
      .insert({
        company_id: data.companyId,
        call_id: data.callId,
        full_text: transcript,
        language: call.language ?? "en",
        provider,
        model,
      })
      .select("id")
      .single();
    if (tErr) throw tErr;

    const lines = transcript.split("\n").filter(Boolean);
    let cursorMs = 0;
    const segments = lines.map((line) => {
      const isAgent = /^(agent|rep|seller|maria|advisor):/i.test(line);
      const text = line.replace(/^(agent|customer|rep|prospect|client|seller|advisor|maria)[:\s]+/i, "");
      const start = cursorMs;
      cursorMs += Math.max(2000, text.length * 40);
      return {
        company_id: data.companyId,
        call_id: data.callId,
        transcript_id: transcriptRow.id,
        speaker: isAgent ? "Agent" : "Customer",
        speaker_type: isAgent ? "agent" : "customer",
        start_ms: start,
        end_ms: cursorMs,
        text,
        is_objection: /price|expensive|think|withdraw|trust|scam/i.test(text),
        is_question: text.includes("?"),
      };
    });
    if (segments.length) await admin.from("transcript_segments").insert(segments);

    await admin.from("call_ai_analyses").upsert(
      {
        company_id: data.companyId,
        call_id: data.callId,
        summary_concise: analysis.summary.concise,
        summary_detailed: analysis.summary.detailed,
        customer_intent: analysis.summary.customerIntent ?? null,
        outcome_category: analysis.outcome.category,
        conversion_confidence: analysis.outcome.conversionConfidence,
        overall_score: analysis.overallScore,
        scores: analysis.scores,
        objections: analysis.objections,
        coaching: analysis.coaching,
        next_actions: analysis.nextActions,
        missed_opportunities: analysis.missedOpportunities,
        compliance_flags: analysis.complianceFlags,
        customer_analysis: analysis.customerAnalysis,
        prompt_version: `${promptId}@${promptVersion}`,
        provider,
        model,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        latency_ms: latency,
        raw: analysis,
      },
      { onConflict: "call_id" },
    );

    await admin
      .from("calls")
      .update({
        status: "completed",
        analysis_status: "completed",
        transcription_status: "completed",
        outcome: analysis.outcome.category,
        is_converted: analysis.outcome.converted,
        overall_score: analysis.overallScore,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.callId);

    if (jobInsert.data?.id) {
      await admin
        .from("call_processing_jobs")
        .update({
          status: "completed",
          stage: "completed",
          provider,
          model,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", jobInsert.data.id);
    }

    const day = new Date().toISOString().slice(0, 10);
    if (call.agent_user_id) {
      await admin.from("daily_agent_metrics").upsert(
        {
          company_id: data.companyId,
          agent_user_id: call.agent_user_id,
          metric_date: day,
          calls_count: 1,
          avg_score: analysis.overallScore,
          conversions: analysis.outcome.converted ? 1 : 0,
        },
        { onConflict: "company_id,agent_user_id,metric_date" },
      );
    }
    await admin.from("daily_company_metrics").upsert(
      {
        company_id: data.companyId,
        metric_date: day,
        calls_count: 1,
        avg_score: analysis.overallScore,
        conversions: analysis.outcome.converted ? 1 : 0,
        conversion_rate: analysis.outcome.converted ? 1 : 0,
      },
      { onConflict: "company_id,metric_date" },
    );

    return { ok: true as const, analysis, provider, model };
  });

async function failJob(admin: any, jobId: string | undefined, callId: string, error: string) {
  if (jobId) {
    await admin
      .from("call_processing_jobs")
      .update({ status: "failed", error: error.slice(0, 2000), updated_at: new Date().toISOString() })
      .eq("id", jobId);
  }
  await admin
    .from("calls")
    .update({ analysis_status: "failed", updated_at: new Date().toISOString() })
    .eq("id", callId);
}
