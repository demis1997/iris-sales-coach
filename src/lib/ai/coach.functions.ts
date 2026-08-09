import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const coachInput = z.object({
  transcript: z.string().min(20),
  repName: z.string().optional(),
  product: z.string().optional(),
  callType: z.string().optional(),
  icp: z.string().optional(),
  contactName: z.string().optional(),
  contactCompany: z.string().optional(),
});

/**
 * Server-only transcript coaching.
 * Prefers the centralized AIService prompt pipeline (mock for demo / OpenAI when keyed).
 * Falls back to the legacy Cursor/OpenAI coach helper if needed.
 */
export const coachTranscript = createServerFn({ method: "POST" })
  .validator((data: unknown) => coachInput.parse(data))
  .handler(async ({ data }) => {
    try {
      const { createAIService } = await import("@/ai/services/ai-service");
      const { toLegacyCallAnalysis, toPostCallReview } = await import(
        "@/ai/adapters/to-legacy-analysis"
      );

      const preferOpenAI =
        Boolean(process.env.OPENAI_API_KEY) &&
        (process.env.ARTEMIS_AI_PROVIDER || "").toLowerCase() === "openai";

      const ai = createAIService(preferOpenAI ? "openai" : "mock");
      const companyContext = {
        contactName: data.contactName,
        contactCompany: data.contactCompany,
        callType: data.callType,
        icp: data.icp,
      };

      const analysisResult = await ai.analyzeCall(
        {
          company_context: companyContext,
          product_context: data.product || "unknown",
          sales_playbook: {},
          transcript: data.transcript,
        },
        { demo: !preferOpenAI },
      );

      const coachingResult = await ai.coachAgent(
        {
          transcript: data.transcript,
          call_analysis: analysisResult.data,
          agent_profile: { name: data.repName || "agent" },
          company_playbook: {},
          scorecard: {},
        },
        { demo: !preferOpenAI, agentId: data.repName },
      );

      return {
        ok: true as const,
        provider: analysisResult.provider,
        model: analysisResult.model,
        promptId: analysisResult.promptId,
        promptVersion: analysisResult.promptVersion,
        analysis: toLegacyCallAnalysis(analysisResult.data, coachingResult.data),
        review: toPostCallReview(analysisResult.data, coachingResult.data),
      };
    } catch (pipelineErr) {
      console.warn("[coachTranscript] AIService pipeline failed, trying legacy coach", pipelineErr);
      const { analysisToPostCallReview, coachFromTranscript } = await import("@/lib/ai/coach");
      const result = await coachFromTranscript(data.transcript, {
        repName: data.repName,
        product: data.product,
        callType: data.callType,
        icp: data.icp,
        contactName: data.contactName,
        contactCompany: data.contactCompany,
      });

      return {
        ok: true as const,
        provider: result.provider,
        model: result.model,
        promptId: "legacy_sales_coach" as const,
        promptVersion: "0.0.0" as const,
        analysis: result.coaching,
        review: analysisToPostCallReview(result.coaching),
      };
    }
  });
