import { LlmProviderError } from "@/lib/ai/providers/errors";
import { extractFirstJsonObject } from "@/lib/ai/providers/json";

function env(name: string, fallback = "") {
  return String(process.env[name] || fallback).trim();
}

function required(name: string) {
  const v = env(name);
  if (!v) throw new LlmProviderError(`Missing ${name}`, { code: "missing_env" });
  return v;
}

function clamp(s: string, maxChars: number) {
  const t = String(s || "");
  return t.length <= maxChars ? t : `${t.slice(0, maxChars)}\n[truncated:${t.length - maxChars} chars]`;
}

function parseJsonFromText(text: string) {
  try {
    return JSON.parse(String(text || ""));
  } catch {
    return extractFirstJsonObject(text);
  }
}

function normalizedJsonFromProviderBody(body: unknown): unknown {
  if (body == null) return null;
  if (typeof body === "string") return parseJsonFromText(body);

  const content = (body as { choices?: { message?: { content?: string } }[] })?.choices?.[0]
    ?.message?.content;
  if (typeof content === "string") {
    try {
      return JSON.parse(content);
    } catch {
      try {
        return extractFirstJsonObject(content);
      } catch {
        return body;
      }
    }
  }

  return body;
}

function buildAuthHeaders(apiKey: string): Record<string, string> {
  // Cursor APIs prefer Basic (key as username, empty password). Bearer also works on some routes.
  const mode = env("CURSOR_API_AUTH_MODE", "basic").toLowerCase();
  if (mode === "bearer") {
    return {
      [env("CURSOR_API_AUTH_HEADER", "Authorization")]:
        `${env("CURSOR_API_AUTH_PREFIX", "Bearer")} ${apiKey}`,
    };
  }
  const pass = env("CURSOR_API_BASIC_PASSWORD", "");
  const token = Buffer.from(`${apiKey}:${pass}`, "utf8").toString("base64");
  return { Authorization: `Basic ${token}` };
}

export function isCursorConfigured() {
  const key = env("CURSOR_API_KEY");
  const endpoint = env("CURSOR_API_ENDPOINT", "https://api.cursor.com/v1/chat/completions");
  // Reject misconfigured endpoint that accidentally equals the API key
  if (!key || !endpoint) return false;
  if (endpoint === key) return false;
  if (!/^https?:\/\//i.test(endpoint)) return false;
  return true;
}

export function createCursorProvider() {
  const endpoint = required("CURSOR_API_ENDPOINT");
  const apiKey = required("CURSOR_API_KEY");
  if (endpoint === apiKey || !/^https?:\/\//i.test(endpoint)) {
    throw new LlmProviderError(
      "CURSOR_API_ENDPOINT must be an https URL (e.g. https://api.cursor.com/v1/chat/completions)",
      { code: "bad_env" },
    );
  }
  const modelDefault = env("CURSOR_MODEL", "composer-2");

  return {
    kind: "cursor" as const,
    modelDefault,
    async runJson({
      system,
      user,
      model,
      timeoutMs = 60_000,
    }: {
      system?: string;
      user: string;
      model?: string;
      timeoutMs?: number;
    }) {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const resp = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...buildAuthHeaders(apiKey),
          },
          body: JSON.stringify({
            model: model || modelDefault,
            messages: [
              ...(system ? [{ role: "system", content: clamp(system, 6_000) }] : []),
              { role: "user", content: clamp(user, 50_000) },
            ],
            response_format: { type: "json_object" },
            temperature: 0.2,
          }),
          signal: controller.signal,
        });

        const text = await resp.text().catch(() => "");
        if (!resp.ok) {
          throw new LlmProviderError(`Cursor LLM request failed (${resp.status})`, {
            code: "http_error",
            cause: text.slice(0, 600),
          });
        }

        let outer: unknown;
        try {
          outer = JSON.parse(text);
        } catch {
          outer = { _raw: text };
        }

        const usage = (outer as { usage?: { prompt_tokens?: number; completion_tokens?: number } })
          ?.usage;

        return {
          json: normalizedJsonFromProviderBody(outer),
          rawText: text,
          meta: {
            status: resp.status,
            inputTokens: usage?.prompt_tokens ?? null,
            outputTokens: usage?.completion_tokens ?? null,
            model: model || modelDefault,
          },
        };
      } finally {
        clearTimeout(t);
      }
    },
  };
}
