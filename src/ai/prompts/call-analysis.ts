import { GLOBAL_SYSTEM_PROMPT } from "@/ai/prompts/global-system";
import { CallAnalysisSchema } from "@/ai/schemas/call-analysis.schema";
import type { PromptDefinition } from "@/ai/types/ai.types";

export const callAnalysisPrompt: PromptDefinition<typeof CallAnalysisSchema> = {
  id: "call_analysis",
  version: "1.0.0",
  description: "Convert a raw call transcript into structured call intelligence.",
  modelTier: "balanced",
  systemPrompt: GLOBAL_SYSTEM_PROMPT,
  outputSchema: CallAnalysisSchema,
  userPromptTemplate: `TASK: Analyze this sales conversation and convert it into structured call intelligence.

INPUTS

Company context:
{{company_context}}

Product:
{{product_context}}

Sales playbook:
{{sales_playbook}}

Call transcript:
<<<TRANSCRIPT>>>
{{transcript}}
<<<END_TRANSCRIPT>>>

Analyze:

CALL SUMMARY
- concise summary
- detailed summary
- primary customer objective
- products discussed
- commitments made
- unresolved issues

CUSTOMER SIGNALS
- interest level
- buying intent
- objections
- questions
- concerns
- timing signals
- trust signals
- competitor mentions

CALL STAGE

Determine which stages occurred:
- Opening
- Discovery
- Qualification
- Presentation
- Objection Handling
- Closing
- Follow-Up

OUTCOME

Determine:
- outcome
- conversion status
- likely reason for outcome
- follow-up required
- next best action

KEY MOMENTS

Identify the most important conversation moments.
For each: timestamp, speaker, event type, what happened, why it matters.

Possible event types:
BUYING_SIGNAL, OBJECTION, DISCOVERY, MISSED_OPPORTUNITY, GOOD_PRACTICE,
COMPLIANCE_RISK, CLOSING_OPPORTUNITY, CUSTOMER_CONCERN, NEXT_STEP

Do not infer information not supported by the transcript.
Return ONLY valid JSON matching the schema.`,
};
