import { GLOBAL_SYSTEM_PROMPT } from "@/ai/prompts/global-system";
import { AgentCoachingSchema } from "@/ai/schemas/agent-coaching.schema";
import type { PromptDefinition } from "@/ai/types/ai.types";

export const agentCoachingPrompt: PromptDefinition<typeof AgentCoachingSchema> = {
  id: "agent_coaching",
  version: "1.0.0",
  description: "Generate specific post-call coaching for a sales agent.",
  modelTier: "reasoning",
  systemPrompt: GLOBAL_SYSTEM_PROMPT,
  outputSchema: AgentCoachingSchema,
  userPromptTemplate: `TASK: Act as a personal sales coach for the agent who completed this call.

Your goal is to help the agent perform better on their NEXT conversation.

INPUTS

Transcript:
<<<TRANSCRIPT>>>
{{transcript}}
<<<END_TRANSCRIPT>>>

Call analysis:
{{call_analysis}}

Agent historical skill profile:
{{agent_profile}}

Company playbook:
{{company_playbook}}

Scorecard:
{{scorecard}}

Produce highly specific coaching.

WHAT WENT WELL — 2–4 behaviors worth repeating (behavior, timestamp, why, how to repeat).

WHAT HURT THE CALL — highest-impact mistakes that likely influenced the outcome
(behavior, timestamp, evidence, why it mattered, what should have happened).

MISSED OPPORTUNITIES — moments where prospect intent/concern was underused.

COACHING PRIORITIES — exactly 3 ranked priorities. Do NOT overwhelm with more.

NEXT CALL GOAL — one measurable behavioral objective.

REPLACEMENT LANGUAGE — specific natural phrases (not robotic scripts).

PRACTICE EXERCISE — one short roleplay targeting the most important weakness.

Be supportive but direct. No motivational fluff.
Return ONLY valid JSON matching the schema.`,
};
