export function extractFirstJsonObject(text: string): unknown {
  const t = String(text || "");
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start >= 0 && end > start) return JSON.parse(t.slice(start, end + 1));
  throw new Error("No JSON object found in output.");
}

function truthyEnv(name: string) {
  return /^(1|true|yes|on)$/i.test(String(process.env[name] || "").trim());
}

function truncateForLog(s: unknown, max = 6000) {
  const t = String(s ?? "");
  return t.length <= max ? t : `${t.slice(0, max)}\n[truncated:${t.length - max} chars]`;
}

export async function runHostedLlmJson(opts: {
  system?: string;
  user: string;
  model?: string;
  timeoutMs?: number;
  step?: string;
}) {
  const { createCursorProvider } = await import("@/lib/ai/providers/cursor");
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

  return { ...r, meta: { ...(r.meta || {}), kind: "cursor" as const } };
}
