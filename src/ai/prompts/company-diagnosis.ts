import { GLOBAL_SYSTEM_PROMPT } from "@/ai/prompts/global-system";
import { CompanyDiagnosisSchema } from "@/ai/schemas/company-diagnosis.schema";
import type { PromptDefinition } from "@/ai/types/ai.types";

export const companyDiagnosisPrompt: PromptDefinition<typeof CompanyDiagnosisSchema> = {
  id: "company_diagnosis",
  version: "1.0.0",
  description: "Diagnose systemic weaknesses in the company sales process.",
  modelTier: "reasoning",
  systemPrompt: GLOBAL_SYSTEM_PROMPT,
  outputSchema: CompanyDiagnosisSchema,
  userPromptTemplate: `TASK: Diagnose systemic weaknesses in the company's sales process.

Analyze aggregated behavior across calls, agents, managers, campaigns and outcomes.

INPUTS

{{company_dataset}}

Separate problems into areas:
PEOPLE, PROCESS, LEAD_QUALITY, PRODUCT, PRICING, TRAINING, MANAGEMENT, FOLLOW_UP, COMPLIANCE

For each potential issue provide:
finding, evidence, confidence, scope, estimated impact, recommended experiment

Do not assume every conversion problem is caused by sales agents.
Recommend experiments before major organizational changes.
Return ONLY valid JSON matching the schema.`,
};
