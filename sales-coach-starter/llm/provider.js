export class LlmProviderError extends Error {
  constructor(message, { code = "llm_error", cause = null } = {}) {
    super(message);
    this.name = "LlmProviderError";
    this.code = code;
    this.cause = cause;
  }
}

function truthyEnv(name) {
  return /^(1|true|yes|on)$/i.test(String(process.env[name] || "").trim());
}

function truncateForLog(s, max = 6000) {
  const t = String(s ?? "");
  return t.length <= max ? t : `${t.slice(0, max)}\n[truncated:${t.length - max} chars]`;
}

export function extractFirstJsonObject(text) {
  const t = String(text || "");
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start >= 0 && end > start) return JSON.parse(t.slice(start, end + 1));
  throw new Error("No JSON object found in output.");
}

/**
 * Run a hosted LLM call that returns parsed JSON.
 * Currently routes to Cursor's OpenAI-compatible chat completions API.
 */
export async function runHostedLlmJson(opts = {}) {
  const { createCursorProvider } = await import("./hostedCursor.js");
  const provider = createCursorProvider();
  const step = opts.step || "llm";

  if (truthyEnv("DEBUG_LLM")) {
    console.log(`[llm][cursor] request step=${step}`, {
      model: opts.model || null,
      system: truncateForLog(opts.system, 4000),
      user: truncateForLog(opts.user, 8000),
    });
  }

  const r = await provider.runJson(opts);

  if (truthyEnv("DEBUG_LLM")) {
    console.log(`[llm][cursor] response step=${step}`, {
      meta: r?.meta || null,
      json: r?.json ?? null,
    });
  }

  return { ...r, meta: { ...(r.meta || {}), kind: "cursor" } };
}
