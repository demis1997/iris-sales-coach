# Project Artemis

AI sales coaching and telephone-call engineering for forex-broker teams. Existing TanStack Start, React, Supabase and Lovable architecture is retained.

**Status: local implementation under validation, not production-ready.** No live-provider call, deployed Supabase integration, FXBO sync or end-to-end telephone latency has been verified. No paid operation or deployment was performed during implementation.

## Local start — no paid credentials

Requires Node 22.20.x and npm. Use the npm lockfile (`bun.lock` is historical).

```sh
npm ci --ignore-scripts
npm run dev
```

Open the URL printed by Vite, then `/demo/agent/live` for the existing explicitly simulated conversation and review. With no Supabase configuration the product workspace also carries a simulation banner. Demo fixtures do not create actual calls, real leads, CRM activities or billing results.

```sh
npm run build
npm run typecheck
npm run lint
npm test
```

Build first after adding routes, because TanStack generates its route manifest. Tests use explicit external-service doubles and a local PGlite PostgreSQL engine with test Auth/Storage schemas. They never initiate a paid call or query a real provider. PGlite checks are not a substitute for a deployed Supabase/Auth/Storage/Realtime test.

## Implementation

- Authenticated company-scoped analysis; role checks, private recordings and stricter SQL tenant/parent consistency.
- Twilio click-to-call reservation, idempotency, consent-reference and suppression checks, rate limits, signed callbacks and monotonic provider status. Ambiguous creation is never retried automatically.
- Configurable Venice structured analysis and SSE streaming with cancellation, bounded responses, timeout/retry handling, explicit model fallback and usage metadata. No simulated fallback in live analysis.
- Actual recorded-speech Deepgram adapter. Missing STT fails explicitly; no invented transcript or timestamp.
- Persistent voice worker for Twilio Media Streams, Deepgram STT, silent human coaching or inbound AI response orchestration, configurable Deepgram/ElevenLabs TTS, interruption and human handoff. **Provider path not yet verified.** Generated AI text is distinguished from confirmed telephone playback.
- Leased analysis queue and atomic fenced result commits. Provider rates must be configured for cost estimates; unknown cost is null.
- Database-derived call metrics with documented UTC windows. Sample-only screens are unavailable in the live workspace; simulations remain under `/demo`.
- Internal leads, consent records/withdrawal suppression, manual qualification states, tasks and internal appointments with tenant isolation.
- CRM adapter contract and blocked durable outbox. **FXBO is not implemented or connected.**

Recording is disabled pending a reviewed jurisdiction/consent workflow. Prospect-leg answer metrics, campaign automation, external calendar invitations, CRM reconciliation, tested retention/deletion and real-provider end-to-end validation remain release blockers. See the detailed status below before demonstrating operational functionality.

## Guides and evidence

- [Audit and baseline](docs/engineering/AUDIT.md)
- [Implementation sequence](docs/engineering/PLAN.md)
- [Architecture and trust boundaries](docs/engineering/ARCHITECTURE.md)
- [Local development](docs/engineering/LOCAL_DEVELOPMENT.md)
- [Real-call setup](docs/engineering/REAL_CALL_SETUP.md)
- [Venice integration](docs/engineering/VENICE.md)
- [CRM integration](docs/engineering/CRM.md)
- [Security assessment](docs/engineering/SECURITY.md)
- [Deployment checklist](docs/engineering/DEPLOYMENT.md)
- [Validation and remaining blockers](docs/engineering/VERIFICATION.md)

Copy `.env.example` into an ignored `.env` for a dedicated non-production setup. Never put service-role, telephony, LLM or speech keys in VITE_* variables. Paid operations require explicit operator enablement; mere presence of keys is not approval to make a customer call.

Call privacy controls and operator deletion limits: [Call erasure guide](docs/engineering/CALL_ERASURE.md).
