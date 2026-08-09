# Step 1 — Make accounts real

Site: https://www.project-artemis.ai/  
Project: https://supabase.com/dashboard/project/xhkxbynolnhkjconbxtu

## Done locally

- Keys in `.env` (Vite + server)
- Phase 1 tables present (`companies`, `profiles`, `company_memberships`, …)
- Owners redirect to `/ceo` after onboarding

## You must configure in Supabase Auth

**Authentication → URL configuration**

- Site URL: `https://www.project-artemis.ai`
- Redirect URLs include:
  - `https://www.project-artemis.ai/**`
  - `http://localhost:8080/**`

Enable **Email** provider.

## Test

1. https://www.project-artemis.ai/auth (or local `/auth`)
2. Create account with company name
3. Finish `/onboarding`
4. Land on `/ceo`
5. Confirm rows in `companies` + `company_memberships`

## Next SQL (Steps 3–4)

Paste and run: `supabase/apply_phase2_calls.sql`  
Then upload a call at `/app/calls`.
