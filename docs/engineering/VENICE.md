# Venice integration

Official documentation checked 2026-10-14: [chat completions](https://docs.venice.ai/api-reference/endpoint/chat/completions). Uses `https://api.venice.ai/api/v1/chat/completions`, server Bearer authentication, configurable model, JSON mode for schema-validated analysis and SSE for conversational tokens. No provider account was accessed.

Set `ARTEMIS_AI_PROVIDER=venice`, `VENICE_API_KEY` and an account-supported `VENICE_MODEL`. `VENICE_FALLBACK_MODEL` is optional and used for explicit model-not-found responses. Unsupported JSON/model combinations fail; there is no demo fallback. Tokens and response sizes are bounded. Rate-limit/upstream overload retries are bounded and happen before consuming a stream. Interrupted streams are errors, not successful answers. Abort signals cancel obsolete conversation requests.

Usage records contain provider/model, prompt ID/version, latency and token counts when returned. Set `VENICE_INPUT_USD_PER_MILLION` and `VENICE_OUTPUT_USD_PER_MILLION` to reviewed model rates if estimates are wanted. Unknown price/usage produces null, not zero cost. These estimates are not invoice reconciliation; failed attempts can incur provider charges not included in a successful response's usage.

Venice handles conversational intelligence here. Telephony is Twilio, streaming STT is Deepgram, and configurable TTS is Deepgram/ElevenLabs. Do not infer telephone latency or all model/language capabilities from an OpenAI-compatible request shape.

Prompt injection defenses delimit untrusted conversation/knowledge, disallow financial advice/guaranteed returns and expose no action tools. These defenses and a narrow output phrase check are not a complete compliance or content-safety guarantee. Review prompts, jurisdiction and adversarial examples before use with customers. The existing 13 analysis prompts retain their own versions; live voice/coaching prompts are documented code artifacts and need a unified registry next.
