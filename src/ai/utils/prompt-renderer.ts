export class PromptRenderError extends Error {
  missing: string[];

  constructor(message: string, missing: string[] = []) {
    super(message);
    this.name = "PromptRenderError";
    this.missing = missing;
  }
}

const VAR_RE = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

function formatValue(value: unknown, key: string): string {
  if (value === undefined || value === null) {
    throw new PromptRenderError(`Missing required prompt variable: ${key}`, [key]);
  }
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value, null, 2);
}

/**
 * Interpolate {{variables}} in a prompt template.
 * Throws if any referenced variable is missing or undefined/null.
 */
export function renderPrompt(
  template: string,
  variables: Record<string, unknown>,
): string {
  const missing: string[] = [];
  const used = new Set<string>();

  const rendered = template.replace(VAR_RE, (_match, key: string) => {
    used.add(key);
    if (!(key in variables) || variables[key] === undefined || variables[key] === null) {
      missing.push(key);
      return `{{${key}}}`;
    }
    try {
      return formatValue(variables[key], key);
    } catch (err) {
      if (err instanceof PromptRenderError) missing.push(...err.missing);
      else missing.push(key);
      return `{{${key}}}`;
    }
  });

  if (missing.length) {
    const unique = [...new Set(missing)];
    throw new PromptRenderError(
      `Missing required prompt variable(s): ${unique.join(", ")}`,
      unique,
    );
  }

  return rendered;
}

/** Extract variable names referenced by a template. */
export function listTemplateVariables(template: string): string[] {
  const names = new Set<string>();
  for (const match of template.matchAll(VAR_RE)) {
    names.add(match[1]);
  }
  return [...names];
}

/** Wrap transcript text in a clear delimiter block. */
export function wrapTranscriptBlock(transcript: string): string {
  return `<<<TRANSCRIPT>>>\n${String(transcript || "").trim()}\n<<<END_TRANSCRIPT>>>`;
}
