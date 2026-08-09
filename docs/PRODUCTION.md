# Artemis production runbook

Site: https://www.project-artemis.ai/

## Step 1 — Accounts (in progress)

Keys are in local `.env`. Phase 1 tables exist.

### Supabase Auth URL config (required)

In https://supabase.com/dashboard/project/xhkxbynolnhkjconbxtu/auth/url-configuration

- **Site URL:** `https://www.project-artemis.ai`
- **Redirect URLs:**
  - `https://www.project-artemis.ai/**`
  - `https://www.project-artemis.ai/auth`
  - `https://www.project-artemis.ai/onboarding`
  - `https://www.project-artemis.ai/invite/**`
  - `http://localhost:8080/**` (local)

Enable Email auth. Google/Microsoft optional.

### Hosting env (Lovable / deploy)

Set the same keys as `.env` on the host, plus:

```text
APP_URL=https://www.project-artemis.ai
VITE_PUBLIC_SITE_URL=https://www.project-artemis.ai
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_URL=...
SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # or SUPABASE_SECRET_KEY
```

## Step 2 — Members + multi-company

- CEO employees page reads `company_memberships` + `profiles`
- Company switcher in app header (`active_company_id`)
- Invites: `/invite/$token`

## Step 3–4 — Calls + AI

Apply once in SQL Editor:

`supabase/apply_phase2_calls.sql`

Then:

1. Sign in → `/app/calls`
2. Upload MP3/WAV
3. Analysis runs via server function (OpenAI if `OPENAI_API_KEY` set, else structured stub)
4. Review page: audio + transcript + coaching

## Step 5 — Dashboards

CEO overview shows live member count + recent call metrics when authenticated.
Charts still include demo series until more call volume exists.
