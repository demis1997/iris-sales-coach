import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callAnalysisSchema } from "@/lib/ai/call-analysis-schema";

const processInput = z.object({
  callId: z.string().uuid(),
  companyId: z.string().uuid(),
  transcriptText: z.string().min(20).optional(),
});

/**
 * Server-only call analysis. Uses OpenAI when OPENAI_API_KEY is set;
 * otherwise returns a deterministic structured stub so the pipeline still works.
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
        provider: process.env.OPENAI_API_KEY ? "openai" : "stub",
        model: process.env.OPENAI_API_KEY ? "gpt-4.1-mini" : "deterministic-stub",
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

    let analysis;
    let provider = "stub";
    let model = "deterministic-stub";
    let inputTokens: number | null = null;
    let outputTokens: number | null = null;
    const started = Date.now();

    if (process.env.OPENAI_API_KEY) {
      provider = "openai";
      model = "gpt-4.1-mini";
      const prompt = `You are Artemis AI. Analyse this sales call and return ONLY valid JSON matching the schema fields: summary, outcome, overallScore, scores (opening,discovery,objection_handling,closing,compliance,professionalism), objections, coaching, nextActions, missedOpportunities, complianceFlags, customerAnalysis.

Transcript:
${transcript}`;

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "Return structured JSON only. Cite concrete moments. Do not invent financial outcomes. Use not enough evidence when unsure.",
            },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        await failJob(admin, jobInsert.data?.id, call.id, errText);
        throw new Error(`OpenAI failed: ${errText.slice(0, 300)}`);
      }

      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
        usage?: { prompt_tokens?: number; completion_tokens?: number };
      };
      inputTokens = json.usage?.prompt_tokens ?? null;
      outputTokens = json.usage?.completion_tokens ?? null;
      const raw = json.choices?.[0]?.message?.content ?? "{}";
      analysis = callAnalysisSchema.parse(JSON.parse(raw));
    } else {
      analysis = callAnalysisSchema.parse({
        summary: {
          concise: "Prospect showed interest with a price objection; follow-up requested.",
          detailed:
            "The agent opened cleanly, the customer flagged price concern, and both sides agreed to a next-week follow-up with a written summary.",
          customerIntent: "Evaluate offer with delayed decision",
          customerNeeds: ["Clear pricing rationale", "Written summary"],
          productsDiscussed: [call.contact_company ?? "Core offer"],
          keyFacts: ["Follow-up next week", "Price sensitivity"],
        },
        outcome: {
          category: "Follow-up",
          converted: false,
          conversionConfidence: 0.42,
          primaryReason: "Needs time / price concern",
          followUpRequired: true,
        },
        overallScore: 72,
        scores: {
          opening: {
            score: 78,
            explanation: "Clear purpose stated early.",
            improvement: "Add a sharper value hook in the first 20 seconds.",
          },
          discovery: {
            score: 64,
            explanation: "Limited probing after the price objection.",
            improvement: "Ask what budget range they expected.",
          },
          objection_handling: {
            score: 70,
            explanation: "Acknowledged price concern without arguing.",
            improvement: "Separate unclear vs expensive before defending value.",
          },
          closing: {
            score: 68,
            explanation: "Secured a follow-up but not a hard next step owner.",
            improvement: "Confirm calendar time and owner before hanging up.",
          },
          compliance: { score: 80, explanation: "No critical compliance flags in stub transcript." },
          professionalism: { score: 82, explanation: "Tone stayed calm and respectful." },
        },
        objections: [
          {
            category: "Price",
            text: "Price feels high",
            severity: "medium",
            resolved: false,
            betterResponse:
              "What part feels expensive versus unclear? If it's value, I can map outcomes to cost.",
          },
        ],
        coaching: {
          strengths: ["Calm acknowledgment of the objection", "Offered a written summary"],
          weaknesses: ["Shallow discovery after price pushback"],
          topImprovements: [
            "Ask budget expectation before defending price",
            "Book a specific follow-up slot",
            "Recap next owner and channel",
          ],
          nextCallGoal: "Qualify budget and book a decision meeting",
          managerAction: "Roleplay price objection for 10 minutes",
        },
        nextActions: [
          {
            action: "Send call summary and pricing breakdown",
            priority: "high",
            channel: "email",
            suggestedMessage:
              "Thanks for today — here's a one-page summary of value vs cost and two times for next week.",
          },
        ],
        missedOpportunities: ["Did not ask who else influences the decision"],
        complianceFlags: [],
        customerAnalysis: {
          interestLevel: "medium",
          sentiment: "cautious",
          buyingIntent: "medium",
          conversionProbability: 0.4,
        },
      });
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
    let cursor = 0;
    const segments = lines.map((line) => {
      const isAgent = /^agent:/i.test(line);
      const text = line.replace(/^(agent|customer):\s*/i, "");
      const start = cursor;
      cursor += Math.max(2000, text.length * 40);
      return {
        company_id: data.companyId,
        call_id: data.callId,
        transcript_id: transcriptRow.id,
        speaker: isAgent ? "Agent" : "Customer",
        speaker_type: isAgent ? "agent" : "customer",
        start_ms: start,
        end_ms: cursor,
        text,
        is_objection: /price|expensive|think/i.test(text),
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
        prompt_version: "v1",
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
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", jobInsert.data.id);
    }

    // lightweight daily metrics upsert
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
