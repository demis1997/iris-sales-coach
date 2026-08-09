import type { z } from "zod";
import { estimateCostUsd } from "@/ai/utils/ai-logging";
import { extractFirstJsonObject } from "@/lib/ai/providers/json";
import { validateSchema, SchemaValidationError } from "@/ai/utils/schema-validator";
import type { AIProvider, AIResult, GenerateStructuredArgs } from "@/ai/types/ai.types";
import { MODEL_TIER_MAP } from "@/ai/types/ai.types";

function assertServerOnly() {
  if (typeof window !== "undefined") {
    throw new Error("OpenAIProvider is server-side only and must not run in the browser.");
  }
}

async function callOpenAI(opts: {
  systemPrompt: string;
  userPrompt: string;
  model: string;
  timeoutMs: number;
}): Promise<{
  json: unknown;
  rawText: string;
  inputTokens: number | null;
  outputTokens: number | null;
}> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("Missing OPENAI_API_KEY");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs);
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: opts.model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: opts.systemPrompt },
          { role: "user", content: opts.userPrompt },
        ],
      }),
      signal: controller.signal,
    });

    const rawText = await res.text();
    if (!res.ok) throw new Error(`OpenAI failed (${res.status}): ${rawText.slice(0, 300)}`);

    const outer = JSON.parse(rawText) as {
      choices?: { message?: { content?: string } }[];
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    const content = outer.choices?.[0]?.message?.content ?? "{}";
    let json: unknown;
    try {
      json = JSON.parse(content);
    } catch {
      json = extractFirstJsonObject(content);
    }

    return {
      json,
      rawText,
      inputTokens: outer.usage?.prompt_tokens ?? null,
      outputTokens: outer.usage?.completion_tokens ?? null,
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Server-only OpenAI structured generation with one retry on malformed JSON / schema failure.
 */
export class OpenAIProvider implements AIProvider {
  readonly name = "openai";

  async generateStructured<TSchema extends z.ZodTypeAny>(
    args: GenerateStructuredArgs<TSchema>,
  ): Promise<AIResult<z.infer<TSchema>>> {
    assertServerOnly();
    const started = Date.now();
    const model =
      process.env.OPENAI_MODEL?.trim() || MODEL_TIER_MAP[args.modelTier].openai;

    const attempt = async () => {
      const r = await callOpenAI({
        systemPrompt: args.systemPrompt,
        userPrompt: args.userPrompt,
        model,
        timeoutMs: 60_000,
      });
      const data = validateSchema(args.schema, r.json);
      return { ...r, data };
    };

    try {
      let result;
      try {
        result = await attempt();
      } catch (err) {
        const retryable =
          err instanceof SchemaValidationError ||
          (err instanceof Error && /JSON|schema/i.test(err.message));
        if (!retryable) throw err;
        result = await attempt();
      }

      return {
        data: result.data,
        provider: this.name,
        model,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        latencyMs: Date.now() - started,
        estimatedCost: estimateCostUsd({
          provider: this.name,
          inputTokens: result.inputTokens,
          outputTokens: result.outputTokens,
        }),
        rawResponse: result.rawText,
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
        estimatedCost: null,
        promptId: args.promptId,
        promptVersion: args.promptVersion,
        success: false,
        error: err instanceof Error ? err.message : String(err),
        generatedAt: new Date().toISOString(),
      };
    }
  }
}

export function createOpenAIProvider(): AIProvider {
  return new OpenAIProvider();
}
