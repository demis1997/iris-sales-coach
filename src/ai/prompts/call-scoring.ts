import { GLOBAL_SYSTEM_PROMPT } from "@/ai/prompts/global-system";
import { CallScoringSchema } from "@/ai/schemas/call-scoring.schema";
import type { PromptDefinition } from "@/ai/types/ai.types";

export const callScoringPrompt: PromptDefinition<typeof CallScoringSchema> = {
  id: "call_scoring",
  version: "1.0.0",
  description: "Score a sales call against a company scorecard with evidence.",
  modelTier: "balanced",
  systemPrompt: GLOBAL_SYSTEM_PROMPT,
  outputSchema: CallScoringSchema,
  userPromptTemplate: `TASK: Score the sales call according to the provided scorecard.

INPUTS

Transcript:
<<<TRANSCRIPT>>>
{{transcript}}
<<<END_TRANSCRIPT>>>

Scorecard:
{{scorecard}}

Company playbook:
{{company_playbook}}

Evaluate only behaviors supported by evidence.
Score each category from 0–100.

Default categories if scorecard is empty:
Opening, Discovery, Listening, Qualification, Product Knowledge, Clarity,
Rapport, Objection Handling, Closing, Compliance, Next-Step Confirmation

For each category return:
score, confidence, evidence, timestamps, explanation, recommended improvement

IMPORTANT:
- Do not penalize an agent for something that was not relevant to the call.
- If there is insufficient evidence: status = "NOT_ENOUGH_EVIDENCE" and score = null
- Do not fabricate evidence to justify a score.
Return ONLY valid JSON matching the schema.`,
};
