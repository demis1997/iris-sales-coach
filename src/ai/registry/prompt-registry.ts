import { agentCoachingPrompt } from "@/ai/prompts/agent-coaching";
import { callAnalysisPrompt } from "@/ai/prompts/call-analysis";
import { callScoringPrompt } from "@/ai/prompts/call-scoring";
import { companyDiagnosisPrompt } from "@/ai/prompts/company-diagnosis";
import { executiveAdvisorPrompt } from "@/ai/prompts/executive-advisor";
import { liveCopilotPrompt } from "@/ai/prompts/live-copilot";
import { managerAdvisorPrompt } from "@/ai/prompts/manager-advisor";
import { nextBestActionPrompt } from "@/ai/prompts/next-best-action";
import { objectionAnalysisPrompt } from "@/ai/prompts/objection-analysis";
import { weeklyAgentPrompt } from "@/ai/prompts/weekly-agent";
import { weeklyExecutivePrompt } from "@/ai/prompts/weekly-executive";
import { weeklyManagerPrompt } from "@/ai/prompts/weekly-manager";
import { winningBehaviorsPrompt } from "@/ai/prompts/winning-behaviors";
import type { PromptDefinition, PromptId, PromptVersion } from "@/ai/types/ai.types";

export const PROMPT_REGISTRY = {
  call_analysis: callAnalysisPrompt,
  call_scoring: callScoringPrompt,
  agent_coaching: agentCoachingPrompt,
  objection_analysis: objectionAnalysisPrompt,
  live_copilot: liveCopilotPrompt,
  next_best_action: nextBestActionPrompt,
  manager_advisor: managerAdvisorPrompt,
  executive_advisor: executiveAdvisorPrompt,
  company_diagnosis: companyDiagnosisPrompt,
  winning_behaviors: winningBehaviorsPrompt,
  weekly_agent: weeklyAgentPrompt,
  weekly_manager: weeklyManagerPrompt,
  weekly_executive: weeklyExecutivePrompt,
} as const satisfies Record<PromptId, PromptDefinition>;

export function getPromptById(id: PromptId): PromptDefinition {
  const prompt = PROMPT_REGISTRY[id];
  if (!prompt) {
    throw new Error(`Unknown prompt id: ${id}`);
  }
  return prompt;
}

export function listPromptVersions(): Array<{
  id: PromptId;
  version: PromptVersion;
  description: string;
  modelTier: PromptDefinition["modelTier"];
}> {
  return (Object.keys(PROMPT_REGISTRY) as PromptId[]).map((id) => {
    const p = PROMPT_REGISTRY[id];
    return {
      id: p.id,
      version: p.version,
      description: p.description,
      modelTier: p.modelTier,
    };
  });
}

export function listPromptIds(): PromptId[] {
  return Object.keys(PROMPT_REGISTRY) as PromptId[];
}
