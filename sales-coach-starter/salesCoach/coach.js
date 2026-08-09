import { runHostedLlmJson } from "../llm/provider.js";
import { SALES_COACH_SYSTEM, buildSalesCoachUserPrompt } from "./prompts.js";

/**
 * Analyze a sales call transcript and return structured coaching JSON.
 *
 * @param {string} transcript
 * @param {{
 *   repName?: string,
 *   product?: string,
 *   callType?: string,
 *   icp?: string,
 *   model?: string,
 *   timeoutMs?: number,
 * }} [opts]
 */
export async function coachFromTranscript(transcript, opts = {}) {
  const user = buildSalesCoachUserPrompt({
    transcript,
    repName: opts.repName,
    product: opts.product,
    callType: opts.callType,
    icp: opts.icp,
  });

  const { json, rawText, meta } = await runHostedLlmJson({
    step: "sales_coach",
    system: SALES_COACH_SYSTEM,
    user,
    model: opts.model,
    timeoutMs: opts.timeoutMs ?? 60_000,
  });

  return { coaching: json, rawText, meta };
}
