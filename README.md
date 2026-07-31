# Artemis Sales Coach

Artemis is the **AI operating system for high-performance sales teams**. This repository is a TanStack Start + React demo product and marketing site. Conversation analysis, coaching, pipeline risk, playbooks, and training are illustrated with a coherent multi-tenant-aware seed (single demo organisation: Apex Markets).

## Local setup

```bash
bun install
bun run dev
```

App: http://127.0.0.1:5173/

```bash
bun run typecheck
bun run test
bun run lint
bun run build
```

## Environment variables

Copy `.env.example` to `.env` (optional for local demo).

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_AI_PROVIDER` | No | `demo` (default) or `production` |
| `ARTEMIS_AI_PROVIDER` | No | Server-side provider selector (same values) |
| `ARTEMIS_AI_API_KEY` | No | Production AI key — **server only**, never `VITE_` |
| `VITE_PUBLIC_SITE_URL` | No | Canonical site URL for SEO helpers |

No database URL is required today — data is in-memory seed + browser storage for leads/onboarding/integrations.

## Database setup

There is **no production database** in this build. Domain entities live in:

- `src/lib/demo/types.ts` — typed model
- `src/lib/demo/seed.ts` — coherent fixtures
- `src/lib/demo/queries.ts` / `operations.ts` — scoped selectors and mutations
- `src/lib/demo/coherence.ts` — consistency checks (covered by tests)

When a real DB is added, map the same entities (see `ARTEMIS_DATA_MODEL.md`) and keep organisation scoping server-side.

## Seed data

One organisation (**Apex Markets**), three teams, ≥10 active representatives, 25 opportunities, ≥30 calls with analyses, coaching, playbooks, training, alerts, and roleplay sessions.

Validate:

```bash
bun run test
```

## Authentication

Demo auth: `src/lib/auth/demo-auth.ts`

- Login maps work email → seed user
- Session persisted in `sessionStorage`
- Disabled users are rejected
- Password is not enforced; password reset returns an honest “not available” message
- Role switcher in the app shell is for **demo permissions only**

### Demo accounts

| Email | Role |
| --- | --- |
| maya.okonkwo@apexmarkets.demo | Executive |
| jordan.ellis@apexmarkets.demo | Admin |
| alex.moreau@apexmarkets.demo | Manager |
| priya.nair@apexmarkets.demo | Representative |
| disabled@apexmarkets.demo | Disabled (login rejected) |

## AI provider configuration

Abstraction: `src/lib/ai/`

- Default: deterministic **demo** provider (no network, no secrets)
- Production stub reads `ARTEMIS_AI_API_KEY` server-side and falls back to demo if missing

Wire Ask Artemis, analysis, coaching, follow-up email, CRM update, playbook generation, and roleplay feedback through `getAiProvider()`.

## Tests

```bash
bun run test
```

Coverage includes tenant isolation, RBAC, dashboard aggregation, coaching assignment, auth, lead store behaviour, onboarding validation, integration honesty, and seed coherence.

## Deployment

Built with Vite + TanStack Start / Nitro (Lovable Cloudflare target via `@lovable.dev/vite-tanstack-config`).

```bash
bun run build
bun run preview
```

Do not force-push or rewrite published git history on the Lovable-connected branch (`AGENTS.md`).

## Known roadmap integrations

Statuses are truthful in `/integrations` and `/app/integrations`:

- **Available (configurable in demo):** Webhooks, API
- **In development:** Salesforce, HubSpot, Zoom, Teams, Aircall, …
- **Planned:** Pipedrive, Zoho, Dynamics, Twilio, Slack, Zapier, …

Nothing is labelled **Connected** unless configured in the demo workspace.

## Documentation

- `ARTEMIS_ARCHITECTURE.md` — system shape
- `ARTEMIS_DATA_MODEL.md` — entities
- `ARTEMIS_SECURITY_NOTES.md` — security posture
- `ARTEMIS_REBUILD_PLAN.md` — product rebuild phases
