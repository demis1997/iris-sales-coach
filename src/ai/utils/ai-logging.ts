import type { PromptId, PromptVersion } from "@/ai/types/ai.types";

export type AILogEntry = {
  promptId: PromptId;
  promptVersion: PromptVersion;
  provider: string;
  model: string;
  companyId?: string;
  callId?: string;
  agentId?: string;
  userId?: string;
  inputTokens: number | null;
  outputTokens: number | null;
  latencyMs: number;
  estimatedCost: number | null;
  success: boolean;
  error?: string;
  createdAt: string;
};

/**
 * Structured AI metadata logging.
 * Does NOT log full transcripts by default.
 */
export function logAIResult(entry: AILogEntry): void {
  const payload = {
    kind: "artemis_ai",
    ...entry,
  };

  if (entry.success) {
    console.info("[artemis-ai]", JSON.stringify(payload));
  } else {
    console.warn("[artemis-ai]", JSON.stringify(payload));
  }
}

export function estimateCostUsd(opts: {
  provider: string;
  inputTokens: number | null;
  outputTokens: number | null;
}): number | null {
  if (opts.inputTokens == null || opts.outputTokens == null) return null;
  if (opts.provider === "mock") return 0;
  if (opts.provider !== "openai") return null;
  const input = process.env.OPENAI_INPUT_USD_PER_MILLION;
  const output = process.env.OPENAI_OUTPUT_USD_PER_MILLION;
  if (!input?.trim() || !output?.trim()) return null;
  const a = Number(input),
    b = Number(output);
  if (!Number.isFinite(a) || !Number.isFinite(b) || a < 0 || b < 0) return null;
  return (opts.inputTokens * a + opts.outputTokens * b) / 1000000;
}
