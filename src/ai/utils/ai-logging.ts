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
  // Rough placeholder rates — not billing-authoritative.
  const rates =
    opts.provider === "openai"
      ? { in: 0.00015 / 1000, out: 0.0006 / 1000 }
      : { in: 0, out: 0 };
  return Number((opts.inputTokens * rates.in + opts.outputTokens * rates.out).toFixed(6));
}
