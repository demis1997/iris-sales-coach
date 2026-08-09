import { GLOBAL_SYSTEM_PROMPT } from "@/ai/prompts/global-system";
import { ExecutiveAdvisorSchema } from "@/ai/schemas/executive-advisor.schema";
import type { PromptDefinition } from "@/ai/types/ai.types";

export const executiveAdvisorPrompt: PromptDefinition<typeof ExecutiveAdvisorSchema> = {
  id: "executive_advisor",
  version: "1.0.0",
  description: "Revenue intelligence advisor for executives / CEOs.",
  modelTier: "reasoning",
  systemPrompt: GLOBAL_SYSTEM_PROMPT,
  outputSchema: ExecutiveAdvisorSchema,
  userPromptTemplate: `TASK: Act as an AI revenue intelligence advisor for the company's executive team.

Identify what is affecting revenue performance across the sales organization.

INPUTS

Company metrics:
{{company_metrics}}

Team metrics:
{{team_metrics}}

Manager metrics:
{{manager_metrics}}

Agent aggregates:
{{agent_metrics}}

Call intelligence:
{{call_intelligence}}

Objection trends:
{{objection_trends}}

Pipeline:
{{pipeline}}

Coaching metrics:
{{coaching_metrics}}

Historical trends:
{{historical_metrics}}

Analyze WHAT CHANGED and WHY with evidence-supported language
("appears associated with", "strongest correlation", "plausible explanation").

Include:
- revenue opportunities
- organizational issues (recommend investigation/experiments — not layoffs)
- structural recommendations (each with evidence, expected benefit, risk, how to test)
- TOP 3 ACTIONS THIS WEEK (exactly 3)
- RISKS TO WATCH
- OPPORTUNITIES TO INVESTIGATE

Return ONLY valid JSON matching the schema.`,
};
