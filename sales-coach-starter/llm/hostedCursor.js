import { LlmProviderError, extractFirstJsonObject } from "./provider.js";

function env(name, fallback = "") {
  return String(process.env[name] || fallback).trim();
}

function required(name) {
  const v = env(name);
  if (!v) throw new LlmProviderError(`Missing ${name}`, { code: "missing_env" });
  return v;
}

function clamp(s, maxChars) {
  const t = String(s || "");
  return t.length <= maxChars ? t : t.slice(0, maxChars) + `\n[truncated:${t.length - maxChars} chars]`;
}

function parseJsonFromText(text) {
  try {
    return JSON.parse(String(text || ""));
  } catch {
    return extractFirstJsonObject(text);
  }
}

function normalizedJsonFromProviderBody(body) {
  if (body == null) return null;
  if (typeof body === "string") return parseJsonFromText(body);

  const content = body?.choices?.[0]?.message?.content;
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

function buildAuthHeaders(apiKey) {
  const mode = env("CURSOR_API_AUTH_MODE", "bearer").toLowerCase();
  if (mode === "basic") {
    const pass = env("CURSOR_API_BASIC_PASSWORD", "");
    const token = Buffer.from(`${apiKey}:${pass}`, "utf8").toString("base64");
    return { Authorization: `Basic ${token}` };
  }
  return {
    [env("CURSOR_API_AUTH_HEADER", "Authorization")]:
      `${env("CURSOR_API_AUTH_PREFIX", "Bearer")} ${apiKey}`,
  };
}

/**
 * Cursor OpenAI-compatible chat completions client (JSON mode).
 * Uses native fetch (Node 18+).
 */
export function createCursorProvider() {
  const endpoint = required("CURSOR_API_ENDPOINT");
  const apiKey = required("CURSOR_API_KEY");
  const modelDefault = env("CURSOR_MODEL", "composer-2");

  return {
    kind: "cursor",
    async runJson({ system, user, model, timeoutMs = 60_000 } = {}) {
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

        let outer;
        try {
          outer = JSON.parse(text);
        } catch {
          outer = { _raw: text };
        }

        return {
          json: normalizedJsonFromProviderBody(outer),
          rawText: text,
          meta: { status: resp.status },
        };
      } finally {
        clearTimeout(t);
      }
    },
  };
}
