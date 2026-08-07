# Artemis AI — Architecture (Phase 1)

Marketing branding remains **Artemis AI**. The product is a multi-tenant AI contact-center / sales-coaching SaaS (spec often called “Relay AI”).

## Current stack

| Layer | Choice |
|---|---|
| App | TanStack Start + React 19 + TypeScript |
| UI | Tailwind 4 + shadcn/ui + existing Iris/Artemis shells |
| Data fetching | TanStack Query |
| Validation | Zod |
| Auth / DB / Storage | Supabase (Postgres, Auth, RLS) |
| Marketing | `src/components/relay/*` — do not redesign |

## Existing frontend ↔ product routes

| UI today | Spec route |
|---|---|
| `/` | Marketing (preserve) |
| `/auth` | `/login` + register |
| `/app/*` | Agent workspace |
| `/manager/*` | Manager / QA |
| `/ceo/*` | Executive |
| `/crm/*` | CRM / pipeline |
| Dialer, DNA, coach, roleplay, certifications | Advanced AI (later phases) |

## Phase 1 deliverables

1. Multi-tenant schema: companies, profiles, memberships, teams, settings, invitations, onboarding
2. Expanded roles + central permission map
3. RLS on every tenant table
4. Signup creates company + owner membership + defaults
5. Auth session → active company → permission-aware app shell
6. Functional onboarding wizard
7. Route guards (UX) + server-side authorize utility
8. `.env.example` + setup docs

## Security model

- Access always via `company_memberships` (not profile.company_id alone)
- `profiles.active_company_id` is convenience only
- Frontend guards are UX; RLS + `authorize()` enforce security
