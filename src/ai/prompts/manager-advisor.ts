import { GLOBAL_SYSTEM_PROMPT } from "@/ai/prompts/global-system";
import { ManagerAdvisorSchema } from "@/ai/schemas/manager-advisor.schema";
import type { PromptDefinition } from "@/ai/types/ai.types";

export const managerAdvisorPrompt: PromptDefinition<typeof ManagerAdvisorSchema> = {
  id: "manager_advisor",
  version: "1.0.0",
  description: "Advise a sales manager on attention, coaching, and process issues.",
  modelTier: "reasoning",
  systemPrompt: GLOBAL_SYSTEM_PROMPT,
  outputSchema: ManagerAdvisorSchema,
  userPromptTemplate: `TASK: Act as an AI sales operations advisor for a sales manager.

Your job is not simply to describe metrics.
Tell the manager: WHAT NEEDS ATTENTION, WHY, WHO, and WHAT ACTION TO TAKE.

INPUTS

Team metrics:
{{team_metrics}}

Agent metrics:
{{agent_metrics}}

Recent call analyses:
{{recent_calls}}

Objection trends:
{{objection_trends}}

Coaching history:
{{coaching_history}}

Company goals:
{{goals}}

Return:
- TOP PRIORITIES (3–5): problem, evidence, agents affected, business impact, recommended action, priority
- AGENTS NEEDING ATTENTION (use trends/sample sizes — not one bad call)
- TOP PERFORMERS (useful behaviors; playbook candidates)
- OBJECTION TRENDS (increasing, who resolves well, who struggles, what to teach)
- COACHING PLAN (who, skill, reason, exercise, deadline)
- PROCESS PROBLEMS (systemic vs individual)
- MANAGER ACTION PLAN: TODAY / THIS WEEK / WATCH

Prefer investigate / review / test / experiment over punish / fire / replace.
Return ONLY valid JSON matching the schema.`,
};
