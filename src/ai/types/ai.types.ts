import type { z } from "zod";

export type ModelTier = "fast" | "balanced" | "reasoning";

export type PromptId =
  | "call_analysis"
  | "call_scoring"
  | "agent_coaching"
  | "objection_analysis"
  | "live_copilot"
  | "next_best_action"
  | "manager_advisor"
  | "executive_advisor"
  | "company_diagnosis"
  | "winning_behaviors"
  | "weekly_agent"
  | "weekly_manager"
  | "weekly_executive";

export type PromptVersion = `${number}.${number}.${number}`;

export type AIRequestMetadata = {
  companyId?: string;
  callId?: string;
  agentId?: string;
  userId?: string;
  demo?: boolean;
  requestId?: string;
};

export type PromptDefinition<TSchema extends z.ZodTypeAny = z.ZodTypeAny> = {
  id: PromptId;
  version: PromptVersion;
  description: string;
  modelTier: ModelTier;
  systemPrompt: string;
  userPromptTemplate: string;
  outputSchema: TSchema;
};

export type AIResult<T> = {
  data: T;
  provider: string;
  model: string;
  inputTokens: number | null;
  outputTokens: number | null;
  latencyMs: number;
  estimatedCost: number | null;
  rawResponse?: unknown;
  promptId: PromptId;
  promptVersion: PromptVersion;
  success: boolean;
  error?: string;
  generatedAt: string;
};

export type GenerateStructuredArgs<TSchema extends z.ZodTypeAny> = {
  systemPrompt: string;
  userPrompt: string;
  schema: TSchema;
  modelTier: ModelTier;
  metadata?: AIRequestMetadata;
  promptId: PromptId;
  promptVersion: PromptVersion;
};

export interface AIProvider {
  readonly name: string;
  generateStructured<TSchema extends z.ZodTypeAny>(
    args: GenerateStructuredArgs<TSchema>,
  ): Promise<AIResult<z.infer<TSchema>>>;
}

export const MODEL_TIER_MAP: Record<
  ModelTier,
  { openai: string; cursor: string; mock: string }
> = {
  fast: { openai: "gpt-4.1-mini", cursor: "composer-2", mock: "mock-fast" },
  balanced: { openai: "gpt-4.1-mini", cursor: "composer-2", mock: "mock-balanced" },
  reasoning: { openai: "gpt-4.1", cursor: "composer-2", mock: "mock-reasoning" },
};
