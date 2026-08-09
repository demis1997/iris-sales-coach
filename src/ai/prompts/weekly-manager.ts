import { GLOBAL_SYSTEM_PROMPT } from "@/ai/prompts/global-system";
import { WeeklyManagerSchema } from "@/ai/schemas/weekly-manager.schema";
import type { PromptDefinition } from "@/ai/types/ai.types";

export const weeklyManagerPrompt: PromptDefinition<typeof WeeklyManagerSchema> = {
  id: "weekly_manager",
  version: "1.0.0",
  description: "Generate a Monday morning sales manager brief.",
  modelTier: "balanced",
  systemPrompt: GLOBAL_SYSTEM_PROMPT,
  outputSchema: WeeklyManagerSchema,
  userPromptTemplate: `TASK: Generate a Monday morning sales manager brief.

Inputs:
{{team_week}}

Return:
- LAST WEEK IN ONE SENTENCE
- WHAT IMPROVED
- WHAT GOT WORSE
- 3 AGENTS TO PAY ATTENTION TO
- BIGGEST LOST-SALE REASON
- BEST BEHAVIOR TO COPY
- COACHING PRIORITIES
- TOP 3 MANAGER ACTIONS THIS WEEK

Keep it operational and short.
Return ONLY valid JSON matching the schema.`,
};
