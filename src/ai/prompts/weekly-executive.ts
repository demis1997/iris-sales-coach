import { GLOBAL_SYSTEM_PROMPT } from "@/ai/prompts/global-system";
import { WeeklyExecutiveSchema } from "@/ai/schemas/weekly-executive.schema";
import type { PromptDefinition } from "@/ai/types/ai.types";

export const weeklyExecutivePrompt: PromptDefinition<typeof WeeklyExecutiveSchema> = {
  id: "weekly_executive",
  version: "1.0.0",
  description: "Produce a two-minute executive revenue brief for the CEO.",
  modelTier: "balanced",
  systemPrompt: GLOBAL_SYSTEM_PROMPT,
  outputSchema: WeeklyExecutiveSchema,
  userPromptTemplate: `TASK: Produce an executive revenue brief for the CEO.

The CEO has two minutes. Do not overwhelm them with sales analytics.

INPUTS

{{weekly_company_data}}

Return:
- EXECUTIVE SUMMARY (maximum 5 sentences)
- REVENUE — what changed?
- WHY — what appears to have driven it?
- BIGGEST OPPORTUNITY
- BIGGEST RISK
- TEAMS — which teams materially changed?
- MANAGEMENT — coaching or management patterns?
- CUSTOMER SIGNAL — what are prospects saying more frequently?
- 3 DECISIONS / ACTIONS (exactly three, concrete)

Return ONLY valid JSON matching the schema.`,
};
