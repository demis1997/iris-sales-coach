import { GLOBAL_SYSTEM_PROMPT } from "@/ai/prompts/global-system";
import { WinningBehaviorsSchema } from "@/ai/schemas/winning-behaviors.schema";
import type { PromptDefinition } from "@/ai/types/ai.types";

export const winningBehaviorsPrompt: PromptDefinition<typeof WinningBehaviorsSchema> = {
  id: "winning_behaviors",
  version: "1.0.0",
  description: "Identify repeatable behaviors used by successful sales agents.",
  modelTier: "reasoning",
  systemPrompt: GLOBAL_SYSTEM_PROMPT,
  outputSchema: WinningBehaviorsSchema,
  userPromptTemplate: `TASK: Identify repeatable behaviors used by successful sales agents.

INPUTS

High-performing converted calls:
{{winning_calls}}

Comparable unsuccessful calls:
{{lost_calls}}

Only return patterns supported across multiple conversations.

Analyze:
Discovery questions, Talk/listen balance, Call sequencing, Objection responses,
Timing of pitch, Closing behavior, Follow-up confirmation, Product explanation

For each pattern provide:
behavior, winning-call evidence, comparison evidence, frequency, confidence,
possible playbook update

Do not conclude that correlation equals causation.
Recommend candidate playbook changes for manager review.
Never automatically modify the company playbook.
Return ONLY valid JSON matching the schema.`,
};
