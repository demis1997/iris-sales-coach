# Artemis AI — Setup (Phase 1)

## Prerequisites

- Node 22+ / Bun
- A Supabase project (Auth + Postgres)

## Install

```bash
npm install
# or: bun install
```

## Environment

Copy `.env.example` to `.env` and fill values from the Supabase dashboard:

- `VITE_SUPABASE_URL` / `SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_PUBLISHABLE_KEY` (anon / publishable)
- `SUPABASE_SERVICE_ROLE_KEY` (server only — never expose to the browser)

Do not commit `.env`.

## Database

Apply migrations in order from `supabase/migrations/`:

```bash
supabase db push
# or run the SQL files in the Supabase SQL editor
```

Phase 1 migration: `20260806154000_phase1_tenancy.sql`

This creates:

- `company_memberships`, `teams`, `team_members`
- company settings / AI settings / retention
- invitations, onboarding checklists, scorecards, audit logs
- RLS policies and updated signup trigger

## Auth providers (Supabase dashboard)

Enable:

- Email / password
- Magic link (OTP)
- Google
- Microsoft (Azure)

Configure redirect URLs for local and production (`/auth`, `/onboarding`, `/invite/*`).

## Run

```bash
npm run dev
```

## Phase 1 verification checklist

1. Register with company name → company + owner membership created
2. Redirected to `/onboarding`
3. Complete wizard steps (data persists in `companies` / checklist)
4. Invite a user → copy invite link → accept at `/invite/:token`
5. Invited user joins the same company (no second tenant)
6. Workspace switcher respects role permissions
7. Unauthenticated access to `/app` redirects to `/auth`

## Deployment

1. Set all production env vars (see `.env.example`)
2. Apply migrations to the production Supabase project
3. Build: `npm run build`
4. Serve the TanStack Start server entry
5. Keep Lovable-connected git history intact (no force-push / history rewrite)

## Next: Phase 2

Call upload, private storage, processing jobs, transcription, and transcript review.
