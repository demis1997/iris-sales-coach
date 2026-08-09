import { GLOBAL_SYSTEM_PROMPT } from "@/ai/prompts/global-system";
import { WeeklyAgentSchema } from "@/ai/schemas/weekly-agent.schema";
import type { PromptDefinition } from "@/ai/types/ai.types";

export const weeklyAgentPrompt: PromptDefinition<typeof WeeklyAgentSchema> = {
  id: "weekly_agent",
  version: "1.0.0",
  description: "Create an agent's weekly coaching review.",
  modelTier: "balanced",
  systemPrompt: GLOBAL_SYSTEM_PROMPT,
  outputSchema: WeeklyAgentSchema,
  userPromptTemplate: `TASK: Create the agent's weekly coaching review.

INPUTS

Calls this week:
{{calls}}

Skill history:
{{skills}}

Previous coaching goals:
{{previous_goals}}

Team benchmarks:
{{benchmarks}}

Summarize:
YOUR WEEK (calls, conversions, key improvement, primary weakness)
WHAT IMPROVED (evidence across multiple calls)
WHAT IS HOLDING YOU BACK (ONE primary behavior)
BEST CALL (why)
CALL TO REVIEW (most useful learning example)
NEXT WEEK'S GOAL (one measurable goal)
PRACTICE (one roleplay scenario)

Keep the entire response concise and motivating.
Return ONLY valid JSON matching the schema.`,
};
