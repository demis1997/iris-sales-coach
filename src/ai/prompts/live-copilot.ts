import { GLOBAL_SYSTEM_PROMPT } from "@/ai/prompts/global-system";
import { LiveCopilotSchema } from "@/ai/schemas/live-copilot.schema";
import type { PromptDefinition } from "@/ai/types/ai.types";

export const liveCopilotPrompt: PromptDefinition<typeof LiveCopilotSchema> = {
  id: "live_copilot",
  version: "1.0.0",
  description: "Low-latency live call suggestions for an active sales agent.",
  modelTier: "fast",
  systemPrompt: GLOBAL_SYSTEM_PROMPT,
  outputSchema: LiveCopilotSchema,
  userPromptTemplate: `TASK: Provide real-time assistance to a sales agent during an active call.

You receive only the latest conversation context.

Recent transcript:
<<<TRANSCRIPT>>>
{{rolling_transcript}}
<<<END_TRANSCRIPT>>>

Customer context:
{{customer_context}}

Current call stage:
{{call_stage}}

Relevant playbook:
{{retrieved_playbook}}

Return AT MOST 2 suggestions.
Only generate a suggestion when there is a meaningful reason.

Valid reasons:
- objection detected
- buying signal
- unanswered customer question
- missed discovery opportunity
- compliance reminder
- closing opportunity
- customer confusion
- agent talking excessively
- relevant playbook information

Each suggestion must contain:
type, priority, shortTitle, reason, suggestedAction, optionalPhrase

suggestedAction must be under 20 words.
optionalPhrase must sound natural.

Do not constantly coach.
If no useful intervention is needed return: {"suggestions":[]}

The best live coach is often silent.
Return ONLY valid JSON matching the schema.`,
};
