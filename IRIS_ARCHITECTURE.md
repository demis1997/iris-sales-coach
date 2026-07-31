# Iris architecture

## Positioning

Iris is a **sales operating system**: every conversation feeds coaching, pipeline risk, playbooks, training, and reporting — not a standalone call-scoring widget.

## Runtime stack

- **UI:** React 19, TanStack Router (file routes), TanStack Query, Tailwind 4, Radix/shadcn, Recharts, Motion
- **App shell:** `/app/*` with role-aware navigation (`src/components/app/shell.tsx`)
- **Marketing:** public routes under `/`, `/product`, `/solutions`, `/industries/*`, `/pricing`, `/security`, `/book-demo`, `/login`
- **Onboarding:** `/onboarding` guided wizard with local resume

## Data flow (current demo)

```
Seed (seed.ts)
  → Queries / operations (org + role scoped)
    → Session (demo auth + role switcher)
      → Pages (Overview, Calls, Coaching, Team, Pipeline, …)
```

Mutable demo stores (coaching, playbooks, training, roleplay) live in `operations.ts` with `assertOrg` guards.

Browser-only persistence:

- Demo leads (`localStorage`)
- Onboarding progress
- Integration runtime state
- Auth session (`sessionStorage`)

## Service layers

| Layer | Path | Role |
| --- | --- | --- |
| Domain types | `src/lib/demo/types.ts` | Canonical entities |
| Seed + coherence | `seed.ts`, `coherence.ts` | Fixtures + consistency |
| Queries | `queries.ts` | Permission + tenant scoped reads |
| Operations | `operations.ts` | Mutations + skill profiles |
| AI | `src/lib/ai/` | Provider interface (demo vs production) |
| Auth | `src/lib/auth/demo-auth.ts` | Demo login / logout / invite |
| Security | `src/lib/security/` | Tenant asserts, audit log, redaction |
| Knowledge | `src/lib/knowledge/search.ts` | Keyword search; swap for vectors later |
| Pricing | `src/lib/pricing/plans.ts` | Configurable plans (not hardcoded in JSX) |
| Integrations | `src/lib/integrations/catalog.ts` | Shared truthful statuses |
| Analytics | `src/lib/analytics.ts` | Provider-agnostic `track()` |

## Permissions

Roles: representative, manager, director, executive, admin (`rbac.ts`). Sensitive queries call `requirePerm` / `assertTenant` — navigation alone is not the security boundary.

## AI

`getAiProvider()` returns the demo provider unless production env is configured. Ask Iris UI uses `askIrisSafe` with graceful fallback copy.

## Future production shape

1. Real IdP (SSO/OIDC) + httpOnly session cookies
2. Postgres (or equivalent) with organisation FK constraints
3. Server routes for AI, uploads, and CRM OAuth
4. Vector index behind the knowledge `SearchProvider`
5. Replace client lead store with server ingestion + CRM webhook
