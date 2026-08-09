import { callAnalysisSchema, type CallAnalysisResult } from "@/lib/ai/call-analysis-schema";
import {
  buildSalesCoachUserPrompt,
  SALES_COACH_SYSTEM,
  type SalesCoachPromptContext,
} from "@/lib/ai/prompts/sales-coach";
import { runHostedLlmJson } from "@/lib/ai/providers/json";
import { isCursorConfigured } from "@/lib/ai/providers/cursor";
import type { PostCallReview } from "@/lib/demo/live-call/types";

export type CoachProviderKind = "cursor" | "openai" | "stub";

export function resolveCoachProvider(): {
  kind: CoachProviderKind;
  model: string;
} {
  const preferred = (
    process.env.ARTEMIS_AI_PROVIDER ||
    process.env.LLM_PROVIDER ||
    ""
  )
    .trim()
    .toLowerCase();

  if (preferred === "stub") {
    return { kind: "stub", model: "deterministic-stub" };
  }

  // cursor_cloud_agents / demo → use Cursor chat completions for coaching (not Cloud Agents).
  const wantsCursor =
    !preferred ||
    preferred === "cursor" ||
    preferred === "cursor_cloud_agents" ||
    preferred === "demo";

  if ((wantsCursor || preferred !== "openai") && isCursorConfigured()) {
    return {
      kind: "cursor",
      model: process.env.CURSOR_MODEL?.trim() || "composer-2",
    };
  }

  if (process.env.OPENAI_API_KEY) {
    return { kind: "openai", model: process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini" };
  }

  return { kind: "stub", model: "deterministic-stub" };
}

async function runOpenAiJson(opts: {
  system: string;
  user: string;
  model: string;
  timeoutMs: number;
}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), opts.timeoutMs);
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: opts.model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: opts.system },
          { role: "user", content: opts.user },
        ],
      }),
      signal: controller.signal,
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`OpenAI failed: ${text.slice(0, 300)}`);
    const json = JSON.parse(text) as {
      choices?: { message?: { content?: string } }[];
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    const content = json.choices?.[0]?.message?.content ?? "{}";
    return {
      json: JSON.parse(content) as unknown,
      rawText: text,
      meta: {
        kind: "openai" as const,
        status: res.status,
        inputTokens: json.usage?.prompt_tokens ?? null,
        outputTokens: json.usage?.completion_tokens ?? null,
        model: opts.model,
      },
    };
  } finally {
    clearTimeout(t);
  }
}

function stubAnalysis(ctx: SalesCoachPromptContext): CallAnalysisResult {
  const company = ctx.contactCompany || "our offer";
  return callAnalysisSchema.parse({
    summary: {
      concise: "Prospect showed interest with friction; follow-up likely needed.",
      detailed:
        "Stub analysis (no Cursor/OpenAI key configured). The transcript suggests interest with unresolved concerns and a soft next step.",
      customerIntent: "Evaluate offer with delayed decision",
      customerNeeds: ["Clear value", "Written follow-up"],
      productsDiscussed: [company],
      keyFacts: ["Stub provider active — configure CURSOR_API_KEY for live coaching"],
    },
    outcome: {
      category: "Follow-up",
      converted: false,
      conversionConfidence: 0.4,
      primaryReason: "Needs time / unresolved concern",
      followUpRequired: true,
    },
    overallScore: 68,
    scores: {
      opening: {
        score: 72,
        explanation: "Opening appears present in transcript.",
        improvement: "State purpose and value in the first 20 seconds.",
      },
      discovery: {
        score: 60,
        explanation: "Limited discovery depth in stub mode.",
        improvement: "Ask one quantifying pain question before pitching.",
      },
      objection_handling: {
        score: 64,
        explanation: "Objections may be present; stub cannot cite live LLM evidence.",
        improvement: "Acknowledge, isolate, then reframe with proof.",
      },
      closing: {
        score: 62,
        explanation: "Next step may be soft.",
        improvement: "Book a specific time and owner before ending.",
      },
      compliance: { score: 80, explanation: "No critical flags in stub." },
      professionalism: { score: 78, explanation: "Tone assumed professional." },
    },
    objections: [],
    coaching: {
      strengths: ["Kept the conversation moving"],
      weaknesses: ["Stub mode — enable Cursor for evidence-based coaching"],
      topImprovements: [
        "Configure Cursor API for live coaching",
        "Ask a sharper discovery question",
        "Close with a calendar-owned next step",
      ],
      nextCallGoal: "Qualify the main objection and book a decision meeting",
      managerAction: "Review the call with the rep once Cursor coaching is enabled",
    },
    nextActions: [
      {
        action: "Send a short summary and propose two follow-up times",
        priority: "high",
        channel: "email",
        suggestedMessage:
          "Thanks for the conversation — here's a brief recap and two times that work for a follow-up.",
      },
    ],
    missedOpportunities: ["Could not fully evaluate without live AI"],
    complianceFlags: [],
    customerAnalysis: {
      interestLevel: "medium",
      sentiment: "cautious",
      buyingIntent: "medium",
      conversionProbability: 0.4,
    },
  });
}

/**
 * Main Artemis sales coach entry: transcript → structured CallAnalysisResult.
 * Prefers Cursor chat completions when configured.
 */
export async function coachFromTranscript(
  transcript: string,
  opts: Omit<SalesCoachPromptContext, "transcript"> & {
    model?: string;
    timeoutMs?: number;
    forceProvider?: CoachProviderKind;
  } = {},
): Promise<{
  coaching: CallAnalysisResult;
  provider: CoachProviderKind;
  model: string;
  rawText?: string;
  inputTokens: number | null;
  outputTokens: number | null;
}> {
  const ctx: SalesCoachPromptContext = {
    transcript,
    repName: opts.repName,
    product: opts.product,
    callType: opts.callType,
    icp: opts.icp,
    contactName: opts.contactName,
    contactCompany: opts.contactCompany,
  };

  const resolved = resolveCoachProvider();
  const kind = opts.forceProvider ?? resolved.kind;
  const model = opts.model || resolved.model;
  const timeoutMs = opts.timeoutMs ?? 60_000;
  const system = SALES_COACH_SYSTEM;
  const user = buildSalesCoachUserPrompt(ctx);

  if (kind === "stub") {
    return {
      coaching: stubAnalysis(ctx),
      provider: "stub",
      model: "deterministic-stub",
      inputTokens: null,
      outputTokens: null,
    };
  }

  const errors: string[] = [];

  if (kind === "cursor" || isCursorConfigured()) {
    try {
      const { json, rawText, meta } = await runHostedLlmJson({
        step: "sales_coach",
        system,
        user,
        model: opts.model || process.env.CURSOR_MODEL?.trim() || "composer-2",
        timeoutMs,
      });
      const coaching = callAnalysisSchema.parse(json);
      return {
        coaching,
        provider: "cursor",
        model: meta.model || model,
        rawText,
        inputTokens: meta.inputTokens ?? null,
        outputTokens: meta.outputTokens ?? null,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`cursor: ${msg}`);
      console.warn(
        "[artemis-coach] Cursor chat endpoint failed. Tip: api.cursor.com does not currently expose /v1/chat/completions — set OPENAI_API_KEY or point CURSOR_API_ENDPOINT at an OpenAI-compatible proxy.",
        msg,
      );
    }
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      const openAiModel = process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini";
      const { json, rawText, meta } = await runOpenAiJson({
        system,
        user,
        model: openAiModel,
        timeoutMs,
      });
      const coaching = callAnalysisSchema.parse(json);
      return {
        coaching,
        provider: "openai",
        model: meta.model || openAiModel,
        rawText,
        inputTokens: meta.inputTokens ?? null,
        outputTokens: meta.outputTokens ?? null,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`openai: ${msg}`);
      console.warn("[artemis-coach] OpenAI coaching failed", msg);
    }
  }

  if (errors.length) {
    console.warn("[artemis-coach] Falling back to stub analysis:", errors.join(" | "));
  }

  return {
    coaching: stubAnalysis(ctx),
    provider: "stub",
    model: "deterministic-stub",
    inputTokens: null,
    outputTokens: null,
  };
}

/** Map structured analysis into the demo live-call review card shape. */
export function analysisToPostCallReview(analysis: CallAnalysisResult): PostCallReview {
  const objection = analysis.objections[0];
  const improvement = analysis.coaching.topImprovements[0] ?? analysis.coaching.nextCallGoal ?? "";
  const weakness = analysis.coaching.weaknesses[0] ?? analysis.missedOpportunities[0] ?? "";
  const next = analysis.nextActions[0];
  const convPct = Math.round(
    (analysis.customerAnalysis.conversionProbability ?? analysis.outcome.conversionConfidence) * 100,
  );

  return {
    outcome: analysis.outcome.category,
    intent:
      analysis.summary.customerIntent ||
      analysis.customerAnalysis.buyingIntent ||
      "Unknown",
    aiScore: analysis.overallScore,
    conversionProbability: convPct,
    primaryObjection: objection?.text || "None detected",
    nextBestAction: next?.action || analysis.coaching.nextCallGoal || "Follow up",
    didWell: analysis.coaching.strengths.slice(0, 4),
    missedAt: "Key moment",
    missedClient: objection?.text || weakness,
    missedAgent: weakness || "Continued without isolating the concern",
    missedInsight:
      analysis.coaching.nextCallGoal ||
      improvement ||
      "Focus the next call on the highest-leverage gap above.",
    tryInsteadOf: weakness || "The weaker moment in the call",
    tryInstead: objection?.betterResponse || improvement || "Acknowledge, isolate, then advance.",
    followUpTitle: next?.action || "Send follow-up",
    followUpReason: analysis.outcome.primaryReason || analysis.summary.concise,
    suggestedWhatsApp:
      next?.suggestedMessage ||
      `Thanks for the chat — quick recap and next step: ${analysis.coaching.nextCallGoal || "reconnect soon"}.`,
  };
}
