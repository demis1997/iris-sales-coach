import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const coachTranscript = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        transcript: z.string().min(20).max(120000),
        repName: z.string().max(120).optional(),
        product: z.string().max(1000).optional(),
        callType: z.string().max(120).optional(),
        icp: z.string().max(1000).optional(),
        contactName: z.string().max(120).optional(),
        contactCompany: z.string().max(120).optional(),
        demo: z.boolean().optional(),
      })
      .strict()
      .parse(data),
  )
  .handler(async ({ data }) => {
    let companyId: string | undefined;
    if (!data.demo) {
      const { getRequestUserId, loadMembershipForUser } =
        await import("@/lib/telephony/session.server");
      const { assertCanDial } = await import("@/lib/security/call-access");
      const ctx = await loadMembershipForUser(await getRequestUserId());
      assertCanDial(ctx.role);
      const { consumeProviderLimit } = await import("@/lib/security/provider-limit.server");
      await consumeProviderLimit(ctx, "transcript_coaching", 10, 3600);
      if (process.env.ARTEMIS_ENABLE_PAID_AI !== "true")
        throw new Error("Paid AI disabled by operator");
      companyId = ctx.companyId;
    }
    const { createAIService, createLiveAIService } = await import("@/ai/services/ai-service");
    const { toLegacyCallAnalysis, toPostCallReview } =
      await import("@/ai/adapters/to-legacy-analysis");
    const ai = data.demo ? createAIService("mock") : createLiveAIService();
    const metadata = { demo: data.demo === true, companyId };
    const result = await ai.analyzeCall(
      {
        company_context: { contactName: data.contactName, callType: data.callType, icp: data.icp },
        product_context: data.product || "unknown",
        sales_playbook: {},
        transcript: data.transcript,
      },
      metadata,
    );
    const coached = await ai.coachAgent(
      {
        transcript: data.transcript,
        call_analysis: result.data,
        agent_profile: { name: data.repName },
        company_playbook: {},
        scorecard: {},
      },
      metadata,
    );
    return {
      ok: true as const,
      simulated: data.demo === true,
      provider: result.provider,
      model: result.model,
      promptId: result.promptId,
      promptVersion: result.promptVersion,
      analysis: toLegacyCallAnalysis(result.data, coached.data),
      review: toPostCallReview(result.data, coached.data),
    };
  });
