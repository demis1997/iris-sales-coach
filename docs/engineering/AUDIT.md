# Artemis repository audit — 2026-10-14

Baseline: `3a2d8b0` from demis1997/iris-sales-coach. Fresh isolated clone; no existing checkout changed. The user confirms there are no test providers configured. No provider keys are available in this process; no paid call/API request, live database change or deployment is authorised.

## Architecture and inventory

357 tracked files; TanStack Start/React 19/Tailwind, Supabase Auth/Postgres/private Storage, Twilio SDK. Existing marketing, demo workspaces, onboarding and company membership UI are retained. Source includes 13 versioned AI prompts and schema-validated structured analysis with mock/OpenAI providers. There is no Venice implementation at baseline. No production WebSocket media worker, streaming STT/TTS, CRM adapter/worker or deployment health/CI pipeline exists. The Vite preset defaults to Cloudflare, unsuitable to assume an ordinary request handler owns persistent audio sessions.

Reviewed routes/server functions, authentication/session middleware, permission maps, Supabase schema/migrations/policies/grants, telephony/webhooks, AI layers, demo/data imports, main agent/manager/executive dashboards, build/dependencies and deployment/runbooks. No runtime/provider success is inferred from UI or configuration examples.

## Baseline checks

Permissions test passes; AI suite passes 10 tests. Production build passes. Typecheck fails (provider-type mismatch and shared demo component prop contracts). Repository lint fails with 1,074 errors and 12 warnings, predominantly historical formatting. npm audit reports 55 findings (4 critical, 50 high, 1 moderate); inspect exact dependency paths before changing versions. Raw logs are retained locally under work/artemis-baseline. Build success is not typecheck success.

## Priorities

1. **Critical: unauthenticated privileged analysis.** `processCallAnalysis` trusts caller companyId and uses service-role database access without membership/role checks. It can delete/overwrite another tenant's transcripts. `coachTranscript` is also unauthenticated and can spend provider credits.
2. **Critical: fake production analysis.** Missing transcription is replaced with invented sales dialogue, estimated timestamps and stub scoring; fake conversions overwrite daily metrics. Remove these fallbacks from live paths. Simulated fixtures must remain explicit demo-only.
3. **High: telephony boundary.** Public webhooks skip Twilio signature validation when auth token is missing; custom HMAC has a known fallback secret. RecordingUrl is fetched with account credentials without origin/path validation, redirect control, timeout or size bound. Callback status updates ignore ordering/parent SID and database errors.
4. **High: paid operations.** No call-initiation idempotency, explicit marketing-consent/DNC gate, durable rate limit or provider ambiguity handling. Viewer can dial. SMS verification lacks issuance throttling; profiles allow direct verification field updates. Recording defaults on without a deployment consent policy; mute/hold UI only changes local state.
5. **High: tenancy/RBAC.** Membership exists, but service-role handlers bypass RLS. Child records use independent company_id and call_id without composite FK consistency. Child and storage policies expose other agents' records within the same company; broad write grants permit manufactured transcripts/analyses. Team permission semantics need full SQL integration proof.
6. **High: real-time voice absent.** Existing click-to-call rings the rep then dials prospect; no inbound routing, audio streaming, STT, TTS, barge-in or live coaching. No tested latency measurements. No proof of call connection from clicking UI.
7. **High: analytics truth.** CEO live page mixes actual memberships/recent calls with fixed revenue, scores and charts. Recent 100 calls are used for both today/month metrics. Conversion regex can count non-converted outcomes. Daily upserts reset counts to one.
8. **High: CRM missing.** FXBO documentation/credentials unavailable; do not invent endpoints. Require provider contract, mapping, idempotency and outbox/reconciliation before advertising synchronization.
9. **Medium: operations.** No worker leases/backoff/dead-letter retention/deletion verification or tested persistent hosting. Supabase migrations are not validated against an available test project. Existing docs explicitly describe stub production behavior and must be corrected.

## Provider research

Checked official documentation on 2026-10-14: [Venice chat](https://docs.venice.ai/api-reference/endpoint/chat/completions) supports chat/SSE and usage; model-specific features must be configured and tested. Venice LLM streaming alone does not implement telephony or guarantee voice latency. [Twilio signature security](https://www.twilio.com/docs/usage/security) and [Media Stream messages](https://www.twilio.com/docs/voice/media-streams/websocket-messages) define authenticated webhook and media protocol boundaries. No provider account was queried. FXBO API documentation is not supplied.
