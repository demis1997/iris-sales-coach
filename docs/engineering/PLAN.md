# Implementation sequence

Work locally; no commits/push/deploy or paid services without explicit approval. Preserve existing Lovable history and marketing/demo routes.

1. Audit/baseline first (see AUDIT.md). Fix critical authorization and fabricated-data paths before new voice features.
2. Secure company-scoped call lifecycle: explicit role permissions, consent/suppression, request idempotency, provider-SID callback binding and monotonic status. Add service-only atomic SQL operations, composite tenant references and restricted analysis writes. Preserve upload workflows with real transcription or actionable missing-provider failure.
3. Harden Twilio signed callbacks and recording ingestion. Keep real calls opt-in; conservative recording default. Audio worker must use persistent hosting, authenticated streams and bounded queues. Never retry ambiguous call creation automatically.
4. Add server-only configurable Venice provider with validated structured outputs/SSE, cancellation, bounded retries, usage metadata and explicit pricing. Remove implicit mock fallbacks in live analysis. Keep simulation separate.
5. Add cancellation-aware conversational/coaching orchestration with provider interfaces and multilingual/forex safety prompts. CRM adapter boundary plus durable outbox; FXBO remains blocked pending official API contract and sandbox credentials.
6. Replace fabricated live dashboard data with tenant-scoped database aggregates and documented metric windows. Protect stored recordings/transcripts and expose actual error/pending states. Add rate limits/audit and production configuration validation.
7. Tests: unpaid adapter/transport doubles, authorization/tenant/state/replay/consent/interruption failures, existing regression suites, typecheck/build and targeted/full lint outcomes. SQL/provider/browser end-to-end verification must be distinguished from unit tests. Document exact gaps rather than claiming production-ready.

Exit requires an honest capability/status report, architecture, environment template, local/real-call/Venice/CRM guides, deployment checklist, security assessment and reproducible test results. Missing accounts prevent real-provider verification, not local implementation work.

## Execution status

Audit, local hardening, internal lead/follow-up records, provider boundaries, persistent worker source, database queue/metrics, local tests and documentation have been implemented. Full source/SQL/unpaid checks pass. Real telephony/voice and deployed Supabase verification are blocked by the absence of approved test accounts. Recording/privacy lifecycle, prospect-leg accounting, FXBO dispatcher and operational release validation remain engineering work as well as external prerequisites; see VERIFICATION.md. No phase is declared production-complete on the basis of fixtures or PGlite.
