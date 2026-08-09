import { GLOBAL_SYSTEM_PROMPT } from "@/ai/prompts/global-system";
import { ObjectionAnalysisSchema } from "@/ai/schemas/objection-analysis.schema";
import type { PromptDefinition } from "@/ai/types/ai.types";

export const objectionAnalysisPrompt: PromptDefinition<typeof ObjectionAnalysisSchema> = {
  id: "objection_analysis",
  version: "1.0.0",
  description: "Extract and evaluate objections from a sales conversation.",
  modelTier: "balanced",
  systemPrompt: GLOBAL_SYSTEM_PROMPT,
  outputSchema: ObjectionAnalysisSchema,
  userPromptTemplate: `TASK: Analyze objections in this sales conversation.

Transcript:
<<<TRANSCRIPT>>>
{{transcript}}
<<<END_TRANSCRIPT>>>

Company objection playbook:
{{objection_playbook}}

For every objection identify:
- CATEGORY (Price, Trust, Timing, Risk, Withdrawals, Competitor, Need to Think,
  Need Approval, Not Interested, Product Understanding, Previous Bad Experience, Other)
- CUSTOMER OBJECTION (accurate paraphrase)
- TIMESTAMP
- AGENT RESPONSE
- EFFECTIVENESS (0–100)
- WHY (what worked or failed)
- RESOLVED (true / false / uncertain)
- BETTER RESPONSE (natural alternative based on the playbook)
- FOLLOW-UP IMPLICATION

Do not invent objections not present in the transcript.
Return ONLY valid JSON matching the schema.`,
};
