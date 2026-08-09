import { getPromptById } from "@/ai/registry/prompt-registry";
import { createMockAIProvider } from "@/ai/services/mock-ai-provider";
import { createOpenAIProvider } from "@/ai/services/openai-provider";
import type { AIProvider, AIRequestMetadata, AIResult, PromptId } from "@/ai/types/ai.types";
import { logAIResult } from "@/ai/utils/ai-logging";
import { renderPrompt } from "@/ai/utils/prompt-renderer";
import type { CallAnalysisOutput } from "@/ai/schemas/call-analysis.schema";
import type { CallScoringOutput } from "@/ai/schemas/call-scoring.schema";
import type { AgentCoachingOutput } from "@/ai/schemas/agent-coaching.schema";
import type { ObjectionAnalysisOutput } from "@/ai/schemas/objection-analysis.schema";
import type { LiveCopilotOutput } from "@/ai/schemas/live-copilot.schema";
import type { NextBestActionOutput } from "@/ai/schemas/next-best-action.schema";
import type { ManagerAdvisorOutput } from "@/ai/schemas/manager-advisor.schema";
import type { ExecutiveAdvisorOutput } from "@/ai/schemas/executive-advisor.schema";
import type { CompanyDiagnosisOutput } from "@/ai/schemas/company-diagnosis.schema";
import type { WinningBehaviorsOutput } from "@/ai/schemas/winning-behaviors.schema";
import type { WeeklyAgentOutput } from "@/ai/schemas/weekly-agent.schema";
import type { WeeklyManagerOutput } from "@/ai/schemas/weekly-manager.schema";
import type { WeeklyExecutiveOutput } from "@/ai/schemas/weekly-executive.schema";

export type AIServiceMode = "mock" | "openai" | "auto";

function resolveMode(explicit?: AIServiceMode): "mock" | "openai" {
  if (explicit === "mock" || explicit === "openai") return explicit;
  const env = (process.env.ARTEMIS_AI_PROVIDER || process.env.LLM_PROVIDER || "")
    .trim()
    .toLowerCase();
  if (env === "mock" || env === "demo" || env === "stub") return "mock";
  if (process.env.OPENAI_API_KEY) return "openai";
  return "mock";
}

export function createAIProvider(mode?: AIServiceMode): AIProvider {
  const resolved = resolveMode(mode);
  return resolved === "openai" ? createOpenAIProvider() : createMockAIProvider();
}

export class AIService {
  constructor(private readonly provider: AIProvider) {}

  private async run<T>(
    promptId: PromptId,
    variables: Record<string, unknown>,
    metadata?: AIRequestMetadata,
  ): Promise<AIResult<T>> {
    const prompt = getPromptById(promptId);
    const userPrompt = renderPrompt(prompt.userPromptTemplate, variables);
    const result = await this.provider.generateStructured({
      systemPrompt: prompt.systemPrompt,
      userPrompt,
      schema: prompt.outputSchema,
      modelTier: prompt.modelTier,
      metadata,
      promptId: prompt.id,
      promptVersion: prompt.version,
    });

    logAIResult({
      promptId: result.promptId,
      promptVersion: result.promptVersion,
      provider: result.provider,
      model: result.model,
      companyId: metadata?.companyId,
      callId: metadata?.callId,
      agentId: metadata?.agentId,
      userId: metadata?.userId,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      latencyMs: result.latencyMs,
      estimatedCost: result.estimatedCost,
      success: result.success,
      error: result.error,
      createdAt: result.generatedAt,
    });

    if (!result.success) {
      throw new Error(result.error || `AI prompt failed: ${promptId}`);
    }

    return result as AIResult<T>;
  }

  analyzeCall(
    vars: {
      company_context: unknown;
      product_context: unknown;
      sales_playbook: unknown;
      transcript: string;
    },
    metadata?: AIRequestMetadata,
  ) {
    return this.run<CallAnalysisOutput>("call_analysis", vars, metadata);
  }

  scoreCall(
    vars: { transcript: string; scorecard: unknown; company_playbook: unknown },
    metadata?: AIRequestMetadata,
  ) {
    return this.run<CallScoringOutput>("call_scoring", vars, metadata);
  }

  coachAgent(
    vars: {
      transcript: string;
      call_analysis: unknown;
      agent_profile: unknown;
      company_playbook: unknown;
      scorecard: unknown;
    },
    metadata?: AIRequestMetadata,
  ) {
    return this.run<AgentCoachingOutput>("agent_coaching", vars, metadata);
  }

  analyzeObjections(
    vars: { transcript: string; objection_playbook: unknown },
    metadata?: AIRequestMetadata,
  ) {
    return this.run<ObjectionAnalysisOutput>("objection_analysis", vars, metadata);
  }

  getLiveSuggestions(
    vars: {
      rolling_transcript: string;
      customer_context: unknown;
      call_stage: unknown;
      retrieved_playbook: unknown;
    },
    metadata?: AIRequestMetadata,
  ) {
    return this.run<LiveCopilotOutput>("live_copilot", vars, metadata);
  }

  getNextBestAction(
    vars: {
      call_analysis: unknown;
      customer_history: unknown;
      crm_context: unknown;
      sales_process: unknown;
    },
    metadata?: AIRequestMetadata,
  ) {
    return this.run<NextBestActionOutput>("next_best_action", vars, metadata);
  }

  adviseManager(
    vars: {
      team_metrics: unknown;
      agent_metrics: unknown;
      recent_calls: unknown;
      objection_trends: unknown;
      coaching_history: unknown;
      goals: unknown;
    },
    metadata?: AIRequestMetadata,
  ) {
    return this.run<ManagerAdvisorOutput>("manager_advisor", vars, metadata);
  }

  adviseExecutive(
    vars: {
      company_metrics: unknown;
      team_metrics: unknown;
      manager_metrics: unknown;
      agent_metrics: unknown;
      call_intelligence: unknown;
      objection_trends: unknown;
      pipeline: unknown;
      coaching_metrics: unknown;
      historical_metrics: unknown;
    },
    metadata?: AIRequestMetadata,
  ) {
    return this.run<ExecutiveAdvisorOutput>("executive_advisor", vars, metadata);
  }

  diagnoseCompany(vars: { company_dataset: unknown }, metadata?: AIRequestMetadata) {
    return this.run<CompanyDiagnosisOutput>("company_diagnosis", vars, metadata);
  }

  extractWinningBehaviors(
    vars: { winning_calls: unknown; lost_calls: unknown },
    metadata?: AIRequestMetadata,
  ) {
    return this.run<WinningBehaviorsOutput>("winning_behaviors", vars, metadata);
  }

  generateWeeklyAgentReview(
    vars: {
      calls: unknown;
      skills: unknown;
      previous_goals: unknown;
      benchmarks: unknown;
    },
    metadata?: AIRequestMetadata,
  ) {
    return this.run<WeeklyAgentOutput>("weekly_agent", vars, metadata);
  }

  generateWeeklyManagerBrief(vars: { team_week: unknown }, metadata?: AIRequestMetadata) {
    return this.run<WeeklyManagerOutput>("weekly_manager", vars, metadata);
  }

  generateWeeklyExecutiveBrief(
    vars: { weekly_company_data: unknown },
    metadata?: AIRequestMetadata,
  ) {
    return this.run<WeeklyExecutiveOutput>("weekly_executive", vars, metadata);
  }
}

export function createAIService(mode?: AIServiceMode): AIService {
  return new AIService(createAIProvider(mode));
}

/** Convenience singleton for demo/mock paths. */
export const demoAIService = createAIService("mock");
