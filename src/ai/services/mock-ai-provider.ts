import type { z } from "zod";
import { validateSchema } from "@/ai/utils/schema-validator";
import type { AIProvider, AIResult, GenerateStructuredArgs } from "@/ai/types/ai.types";
import { MODEL_TIER_MAP } from "@/ai/types/ai.types";
import { getMockPayload } from "@/ai/fixtures/mock-payloads";

/**
 * Deterministic provider for /demo and local development.
 * Never calls an external LLM.
 */
export class MockAIProvider implements AIProvider {
  readonly name = "mock";

  async generateStructured<TSchema extends z.ZodTypeAny>(
    args: GenerateStructuredArgs<TSchema>,
  ): Promise<AIResult<z.infer<TSchema>>> {
    const started = Date.now();
    const model = MODEL_TIER_MAP[args.modelTier].mock;

    try {
      const raw = getMockPayload(args.promptId, args.userPrompt);
      const data = validateSchema(args.schema, raw);
      return {
        data,
        provider: this.name,
        model,
        inputTokens: Math.ceil(args.userPrompt.length / 4),
        outputTokens: Math.ceil(JSON.stringify(data).length / 4),
        latencyMs: Date.now() - started,
        estimatedCost: 0,
        rawResponse: raw,
        promptId: args.promptId,
        promptVersion: args.promptVersion,
        success: true,
        generatedAt: new Date().toISOString(),
      };
    } catch (err) {
      return {
        data: undefined as unknown as z.infer<TSchema>,
        provider: this.name,
        model,
        inputTokens: null,
        outputTokens: null,
        latencyMs: Date.now() - started,
        estimatedCost: 0,
        promptId: args.promptId,
        promptVersion: args.promptVersion,
        success: false,
        error: err instanceof Error ? err.message : String(err),
        generatedAt: new Date().toISOString(),
      };
    }
  }
}

export function createMockAIProvider(): AIProvider {
  return new MockAIProvider();
}
