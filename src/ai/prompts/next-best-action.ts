import { GLOBAL_SYSTEM_PROMPT } from "@/ai/prompts/global-system";
import { NextBestActionSchema } from "@/ai/schemas/next-best-action.schema";
import type { PromptDefinition } from "@/ai/types/ai.types";

export const nextBestActionPrompt: PromptDefinition<typeof NextBestActionSchema> = {
  id: "next_best_action",
  version: "1.0.0",
  description: "Determine the best next action after a conversation.",
  modelTier: "balanced",
  systemPrompt: GLOBAL_SYSTEM_PROMPT,
  outputSchema: NextBestActionSchema,
  userPromptTemplate: `TASK: Determine the best next action after this conversation.

INPUTS

Call analysis:
{{call_analysis}}

Customer history:
{{customer_history}}

CRM opportunity:
{{crm_context}}

Company sales process:
{{sales_process}}

Determine:
- NEXT ACTION (Call today, Call tomorrow, Send information, Send pricing,
  Send withdrawal documentation, Book meeting, Manager follow-up,
  Compliance review, No follow-up, or other evidence-based action)
- PRIORITY (Critical / High / Medium / Low)
- WHEN (appropriate timeframe)
- WHY (evidence-based)
- CHANNEL (Call / Email / WhatsApp / SMS / Meeting)
- MESSAGE (concise suggested message if appropriate)
- DEAL RISK (Low / Medium / High)
- HUMAN REVIEW REQUIRED (true / false)

Do not invent urgency where none exists.
Return ONLY valid JSON matching the schema.`,
};
