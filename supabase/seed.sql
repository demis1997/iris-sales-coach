-- Phase 1 seed: labelled demo company metadata only.
-- Full demo calls / agents land in later phases.
-- Safe to re-run: uses fixed UUIDs and ON CONFLICT.

insert into public.companies (
  id, name, slug, plan, seats, industry, country, timezone, status, onboarding_completed_at
) values (
  '00000000-0000-4000-8000-000000000001',
  'Artemis Demo Co (DEMO)',
  'artemis-demo',
  'trial',
  20,
  'Financial services',
  'Cyprus',
  'Europe/Nicosia',
  'active',
  now()
) on conflict (id) do update set name = excluded.name;

insert into public.company_settings (company_id)
values ('00000000-0000-4000-8000-000000000001')
on conflict (company_id) do nothing;

insert into public.company_ai_settings (company_id)
values ('00000000-0000-4000-8000-000000000001')
on conflict (company_id) do nothing;

insert into public.company_retention_policies (company_id)
values ('00000000-0000-4000-8000-000000000001')
on conflict (company_id) do nothing;

insert into public.teams (id, company_id, name, description)
values (
  '00000000-0000-4000-8000-000000000011',
  '00000000-0000-4000-8000-000000000001',
  'Demo Sales',
  'DEMO — seed team'
) on conflict (company_id, name) do nothing;

insert into public.scorecards (id, company_id, name, description, is_default)
values (
  '00000000-0000-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000001',
  'Demo sales scorecard',
  'DEMO data — not production performance',
  true
) on conflict (id) do nothing;

insert into public.onboarding_checklists (company_id, completed_at)
values ('00000000-0000-4000-8000-000000000001', now())
on conflict (company_id) do update set completed_at = excluded.completed_at;
