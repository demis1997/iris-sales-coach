export class LlmProviderError extends Error {
  code: string;
  causeDetail: unknown;

  constructor(message: string, { code = "llm_error", cause = null }: { code?: string; cause?: unknown } = {}) {
    super(message);
    this.name = "LlmProviderError";
    this.code = code;
    this.causeDetail = cause;
  }
}
