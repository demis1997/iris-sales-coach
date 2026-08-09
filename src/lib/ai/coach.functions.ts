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
 * Server-only: coach a raw transcript with Cursor (preferred) / OpenAI / stub.
 * Used by demo live call post-call review and ad-hoc coaching.
 */
export const coachTranscript = createServerFn({ method: "POST" })
  .validator((data: unknown) => coachInput.parse(data))
  .handler(async ({ data }) => {
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
      analysis: result.coaching,
      review: analysisToPostCallReview(result.coaching),
    };
  });
