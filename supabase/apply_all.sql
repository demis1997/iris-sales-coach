CREATE TYPE public.app_role AS ENUM ('owner','admin','ceo','manager','rep','qa');

CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  plan text NOT NULL DEFAULT 'trial',
  seats int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  full_name text,
  job_title text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.current_company_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE POLICY "members read own company" ON public.companies FOR SELECT TO authenticated
  USING (id = public.current_company_id());
CREATE POLICY "admins update own company" ON public.companies FOR UPDATE TO authenticated
  USING (id = public.current_company_id() AND (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin')));

CREATE POLICY "read profiles in company" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR (company_id IS NOT NULL AND company_id = public.current_company_id()));
CREATE POLICY "insert own profile" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
CREATE POLICY "update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "read roles in company" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR (company_id IS NOT NULL AND company_id = public.current_company_id()));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (company_id = public.current_company_id() AND (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin')))
  WITH CHECK (company_id = public.current_company_id() AND (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin')));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_company uuid;
BEGIN
  INSERT INTO public.companies (name)
  VALUES (COALESCE(NEW.raw_user_meta_data->>'company_name', split_part(NEW.email,'@',2), 'My company'))
  RETURNING id INTO new_company;

  INSERT INTO public.profiles (id, company_id, full_name)
  VALUES (NEW.id, new_company, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)));

  INSERT INTO public.user_roles (user_id, company_id, role) VALUES (NEW.id, new_company, 'owner');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.current_company_id() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_company_id() TO authenticated;-- Iris AI Revenue Intelligence schema extension
-- Scoped by company_id for multi-tenant RLS. Extends existing companies/profiles/user_roles.
-- INTEGRATION: Wire Edge Functions for STT/LLM writes; UI currently uses demo TS seed.

-- Extend app_role with trainer + executive aliases if needed (executive maps to ceo)
do $$ begin
  alter type public.app_role add value if not exists 'trainer';
exception when duplicate_object then null;
end $$;

create table if not exists public.agent_skill_scores (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  skill text not null,
  score int not null check (score between 0 and 100),
  previous_score int,
  team_avg int,
  top_benchmark int,
  explanation text,
  exercise text,
  revenue_impact_eur numeric,
  evidence_call_id text,
  updated_at timestamptz not null default now()
);

create table if not exists public.coaching_plans (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  focus text not null,
  status text not null default 'Active',
  daily_task text,
  weekly_focus text,
  monthly_goal text,
  completion int default 0,
  before_score int,
  after_score int,
  business_outcome text,
  created_at timestamptz not null default now()
);

create table if not exists public.live_call_suggestions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  call_id text,
  campaign text,
  deal_id text,
  kind text not null,
  detected text,
  suggested_response text,
  why_it_works text,
  confidence int,
  source text,
  feedback text,
  created_at timestamptz not null default now()
);

create table if not exists public.deal_risk_scores (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  deal_key text not null,
  win_probability int not null,
  risk_level text not null,
  forecast_category text,
  confidence int,
  factors jsonb default '{}'::jsonb,
  next_best_actions jsonb default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  min_score int not null default 80,
  expiry_days int default 365,
  required_for text[] default '{}'
);

create table if not exists public.certification_attempts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  certification_id uuid not null references public.certifications(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  score int,
  passed boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists public.campaign_access_rules (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  campaign_name text not null,
  require_certification_ids uuid[] default '{}',
  enabled boolean default true
);

create table if not exists public.playbook_recommendations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null,
  evidence_calls int,
  conversion_lift numeric,
  confidence int,
  status text not null default 'Pending approval',
  source text,
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null,
  doc_type text,
  chunks int default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.qa_reviews (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  call_id text,
  reviewer_id uuid references public.profiles(id),
  ai_score int,
  human_score int,
  flags text[],
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.revenue_attribution (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  profile_id uuid references public.profiles(id),
  coaching_plan_id uuid references public.coaching_plans(id),
  skill text,
  before_score int,
  after_score int,
  conversion_lift numeric,
  revenue_influenced_eur numeric,
  caveat text,
  created_at timestamptz not null default now()
);

-- RLS: company-scoped read/write via current_company_id()
alter table public.agent_skill_scores enable row level security;
alter table public.coaching_plans enable row level security;
alter table public.live_call_suggestions enable row level security;
alter table public.deal_risk_scores enable row level security;
alter table public.certifications enable row level security;
alter table public.certification_attempts enable row level security;
alter table public.campaign_access_rules enable row level security;
alter table public.playbook_recommendations enable row level security;
alter table public.knowledge_documents enable row level security;
alter table public.qa_reviews enable row level security;
alter table public.revenue_attribution enable row level security;

create policy "tenant_select_agent_skill_scores" on public.agent_skill_scores
  for select using (company_id = public.current_company_id());
create policy "tenant_all_agent_skill_scores" on public.agent_skill_scores
  for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "tenant_select_coaching_plans" on public.coaching_plans
  for select using (company_id = public.current_company_id());
create policy "tenant_all_coaching_plans" on public.coaching_plans
  for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "tenant_select_live_call_suggestions" on public.live_call_suggestions
  for select using (company_id = public.current_company_id());
create policy "tenant_all_live_call_suggestions" on public.live_call_suggestions
  for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "tenant_select_deal_risk_scores" on public.deal_risk_scores
  for select using (company_id = public.current_company_id());
create policy "tenant_all_deal_risk_scores" on public.deal_risk_scores
  for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "tenant_select_certifications" on public.certifications
  for select using (company_id = public.current_company_id());
create policy "tenant_all_certifications" on public.certifications
  for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "tenant_select_certification_attempts" on public.certification_attempts
  for select using (company_id = public.current_company_id());
create policy "tenant_all_certification_attempts" on public.certification_attempts
  for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "tenant_select_campaign_access_rules" on public.campaign_access_rules
  for select using (company_id = public.current_company_id());
create policy "tenant_all_campaign_access_rules" on public.campaign_access_rules
  for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "tenant_select_playbook_recommendations" on public.playbook_recommendations
  for select using (company_id = public.current_company_id());
create policy "tenant_all_playbook_recommendations" on public.playbook_recommendations
  for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "tenant_select_knowledge_documents" on public.knowledge_documents
  for select using (company_id = public.current_company_id());
create policy "tenant_all_knowledge_documents" on public.knowledge_documents
  for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "tenant_select_qa_reviews" on public.qa_reviews
  for select using (company_id = public.current_company_id());
create policy "tenant_all_qa_reviews" on public.qa_reviews
  for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "tenant_select_revenue_attribution" on public.revenue_attribution
  for select using (company_id = public.current_company_id());
create policy "tenant_all_revenue_attribution" on public.revenue_attribution
  for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());
-- Phase 1: Multi-tenant foundation for Artemis AI Revenue OS
-- Evolves existing companies/profiles/user_roles into memberships + teams + settings + invitations

-- ── Roles ───────────────────────────────────────────────────────────────────
do $$ begin
  alter type public.app_role add value if not exists 'platform_admin';
exception when duplicate_object then null; end $$;
do $$ begin
  alter type public.app_role add value if not exists 'team_leader';
exception when duplicate_object then null; end $$;
do $$ begin
  alter type public.app_role add value if not exists 'viewer';
exception when duplicate_object then null; end $$;
do $$ begin
  alter type public.app_role add value if not exists 'trainer';
exception when duplicate_object then null; end $$;

-- ── Companies (extend) ──────────────────────────────────────────────────────
alter table public.companies
  add column if not exists industry text,
  add column if not exists country text,
  add column if not exists timezone text default 'UTC',
  add column if not exists company_size text,
  add column if not exists primary_use_case text,
  add column if not exists expected_agent_count int,
  add column if not exists primary_language text default 'en',
  add column if not exists additional_languages text[] default '{}',
  add column if not exists logo_url text,
  add column if not exists currency text default 'EUR',
  add column if not exists status text not null default 'active',
  add column if not exists onboarding_completed_at timestamptz,
  add column if not exists trial_ends_at timestamptz default (now() + interval '14 days'),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists deleted_at timestamptz;

-- ── Profiles (extend) ───────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists email text,
  add column if not exists active_company_id uuid references public.companies(id) on delete set null,
  add column if not exists phone text,
  add column if not exists locale text default 'en',
  add column if not exists deleted_at timestamptz;

update public.profiles set active_company_id = company_id where active_company_id is null and company_id is not null;

-- ── Memberships (canonical tenancy) ─────────────────────────────────────────
create table if not exists public.company_memberships (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'rep',
  status text not null default 'active',
  invited_by uuid references auth.users(id) on delete set null,
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, user_id)
);

create index if not exists company_memberships_user_idx on public.company_memberships (user_id);
create index if not exists company_memberships_company_idx on public.company_memberships (company_id);

-- Backfill from user_roles + profiles
insert into public.company_memberships (company_id, user_id, role, status)
select distinct ur.company_id, ur.user_id, ur.role, 'active'
from public.user_roles ur
where ur.company_id is not null
on conflict (company_id, user_id) do nothing;

insert into public.company_memberships (company_id, user_id, role, status)
select p.company_id, p.id, 'owner', 'active'
from public.profiles p
where p.company_id is not null
  and not exists (
    select 1 from public.company_memberships m
    where m.company_id = p.company_id and m.user_id = p.id
  )
on conflict (company_id, user_id) do nothing;

-- ── Teams ───────────────────────────────────────────────────────────────────
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  description text,
  manager_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (company_id, name)
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (team_id, user_id)
);

create index if not exists team_members_user_idx on public.team_members (user_id);
create index if not exists teams_company_idx on public.teams (company_id);

-- ── Settings ────────────────────────────────────────────────────────────────
create table if not exists public.company_settings (
  company_id uuid primary key references public.companies(id) on delete cascade,
  working_hours jsonb default '{}'::jsonb,
  recording_consent_required boolean not null default true,
  recording_announcement text,
  currency text default 'EUR',
  allow_agent_leaderboard boolean not null default true,
  allow_executive_call_access boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_ai_settings (
  company_id uuid primary key references public.companies(id) on delete cascade,
  coaching_tone text default 'direct',
  scoring_strictness text default 'balanced',
  compliance_sensitivity text default 'standard',
  default_language text default 'en',
  auto_create_coaching_tasks boolean not null default true,
  live_coaching_enabled boolean not null default false,
  allowed_models text[] default array['gpt-4.1-mini'],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_retention_policies (
  company_id uuid primary key references public.companies(id) on delete cascade,
  recording_retention_days int default 365,
  transcript_retention_days int default 365,
  analysis_retention_days int default 730,
  soft_delete_grace_days int default 30,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  theme text default 'system',
  email_notifications boolean not null default true,
  in_app_notifications boolean not null default true,
  timezone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Invitations ─────────────────────────────────────────────────────────────
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  email text not null,
  role public.app_role not null default 'rep',
  team_id uuid references public.teams(id) on delete set null,
  token text not null unique,
  invited_by uuid references auth.users(id) on delete set null,
  status text not null default 'pending',
  expires_at timestamptz not null default (now() + interval '14 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (company_id, email, status)
);

create index if not exists invitations_token_idx on public.invitations (token);

-- ── Onboarding ──────────────────────────────────────────────────────────────
create table if not exists public.onboarding_checklists (
  company_id uuid primary key references public.companies(id) on delete cascade,
  company_profile_done boolean not null default false,
  sales_process_done boolean not null default false,
  team_invites_done boolean not null default false,
  calls_setup_done boolean not null default false,
  ai_config_done boolean not null default false,
  crm_setup_done boolean not null default false,
  sample_call_done boolean not null default false,
  completed_at timestamptz,
  wizard_state jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Default scorecards placeholder (full versioning in Phase 4)
create table if not exists public.scorecards (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  description text,
  is_default boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Audit log (Phase 1 minimal)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource_type text,
  resource_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_company_idx on public.audit_logs (company_id, created_at desc);

-- ── Helper functions ────────────────────────────────────────────────────────
create or replace function public.is_member_of(_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.company_memberships
    where company_id = _company_id
      and user_id = auth.uid()
      and status = 'active'
  );
$$;

create or replace function public.member_role(_company_id uuid)
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.company_memberships
  where company_id = _company_id and user_id = auth.uid() and status = 'active'
  limit 1;
$$;

create or replace function public.active_company_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select active_company_id from public.profiles where id = auth.uid()),
    (select company_id from public.company_memberships where user_id = auth.uid() and status = 'active' order by joined_at limit 1)
  );
$$;

-- Keep current_company_id in sync with new helper for older policies
create or replace function public.current_company_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select public.active_company_id();
$$;

create or replace function public.has_company_role(_company_id uuid, _roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.company_memberships
    where company_id = _company_id
      and user_id = auth.uid()
      and status = 'active'
      and role = any (_roles)
  );
$$;

-- ── Signup trigger: company + membership + defaults ─────────────────────────
-- Invited users pass invitation_token or skip_company=true and do not get a new tenant.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_company uuid;
  company_name text;
  skip_company boolean;
begin
  skip_company := coalesce(new.raw_user_meta_data->>'skip_company', '') = 'true'
    or nullif(new.raw_user_meta_data->>'invitation_token', '') is not null;

  insert into public.user_preferences (user_id) values (new.id) on conflict do nothing;

  if skip_company then
    insert into public.profiles (id, full_name, email)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
      new.email
    );
    return new;
  end if;

  company_name := coalesce(
    new.raw_user_meta_data->>'company_name',
    split_part(new.email, '@', 2),
    'My company'
  );

  insert into public.companies (name, plan, seats, trial_ends_at)
  values (company_name, 'trial', 5, now() + interval '14 days')
  returning id into new_company;

  insert into public.profiles (id, company_id, active_company_id, full_name, email)
  values (
    new.id,
    new_company,
    new_company,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  );

  insert into public.company_memberships (company_id, user_id, role, status)
  values (new_company, new.id, 'owner', 'active');

  -- legacy compatibility
  insert into public.user_roles (user_id, company_id, role)
  values (new.id, new_company, 'owner')
  on conflict (user_id, role) do nothing;

  insert into public.company_settings (company_id) values (new_company);
  insert into public.company_ai_settings (company_id) values (new_company);
  insert into public.company_retention_policies (company_id) values (new_company);

  insert into public.teams (company_id, name, description, manager_user_id)
  values (new_company, 'Sales', 'Default sales team', new.id);

  insert into public.scorecards (company_id, name, description, is_default)
  values
    (new_company, 'Sales quality', 'Default outbound sales scorecard', true),
    (new_company, 'QA compliance', 'Default QA / compliance scorecard', false);

  insert into public.onboarding_checklists (company_id) values (new_company);

  insert into public.audit_logs (company_id, actor_user_id, action, resource_type, resource_id, metadata)
  values (new_company, new.id, 'company.created', 'company', new_company::text, jsonb_build_object('source', 'signup'));

  return new;
end;
$$;

-- ── Grants ──────────────────────────────────────────────────────────────────
grant select, insert, update, delete on public.company_memberships to authenticated;
grant all on public.company_memberships to service_role;
grant select, insert, update, delete on public.teams to authenticated;
grant all on public.teams to service_role;
grant select, insert, update, delete on public.team_members to authenticated;
grant all on public.team_members to service_role;
grant select, insert, update, delete on public.company_settings to authenticated;
grant all on public.company_settings to service_role;
grant select, insert, update, delete on public.company_ai_settings to authenticated;
grant all on public.company_ai_settings to service_role;
grant select, insert, update, delete on public.company_retention_policies to authenticated;
grant all on public.company_retention_policies to service_role;
grant select, insert, update, delete on public.user_preferences to authenticated;
grant all on public.user_preferences to service_role;
grant select, insert, update, delete on public.invitations to authenticated;
grant all on public.invitations to service_role;
grant select, insert, update, delete on public.onboarding_checklists to authenticated;
grant all on public.onboarding_checklists to service_role;
grant select, insert, update, delete on public.scorecards to authenticated;
grant all on public.scorecards to service_role;
grant select, insert on public.audit_logs to authenticated;
grant all on public.audit_logs to service_role;

alter table public.company_memberships enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.company_settings enable row level security;
alter table public.company_ai_settings enable row level security;
alter table public.company_retention_policies enable row level security;
alter table public.user_preferences enable row level security;
alter table public.invitations enable row level security;
alter table public.onboarding_checklists enable row level security;
alter table public.scorecards enable row level security;
alter table public.audit_logs enable row level security;

-- ── RLS policies ────────────────────────────────────────────────────────────
drop policy if exists "members read own company" on public.companies;
drop policy if exists "admins update own company" on public.companies;

create policy "members_select_company" on public.companies for select to authenticated
  using (public.is_member_of(id));
create policy "owners_update_company" on public.companies for update to authenticated
  using (public.has_company_role(id, array['owner','admin']::public.app_role[]))
  with check (public.has_company_role(id, array['owner','admin']::public.app_role[]));

drop policy if exists "read profiles in company" on public.profiles;
create policy "read_profiles_same_company" on public.profiles for select to authenticated
  using (
    id = auth.uid()
    or (
      active_company_id is not null
      and public.is_member_of(active_company_id)
      and public.is_member_of(public.active_company_id())
      and active_company_id = public.active_company_id()
    )
    or (
      company_id is not null
      and public.is_member_of(company_id)
      and company_id = public.active_company_id()
    )
  );

create policy "memberships_select" on public.company_memberships for select to authenticated
  using (user_id = auth.uid() or public.is_member_of(company_id));
create policy "memberships_manage" on public.company_memberships for all to authenticated
  using (public.has_company_role(company_id, array['owner','admin']::public.app_role[]))
  with check (public.has_company_role(company_id, array['owner','admin']::public.app_role[]));

create policy "teams_select" on public.teams for select to authenticated
  using (public.is_member_of(company_id) and deleted_at is null);
create policy "teams_manage" on public.teams for all to authenticated
  using (public.has_company_role(company_id, array['owner','admin','manager']::public.app_role[]))
  with check (public.has_company_role(company_id, array['owner','admin','manager']::public.app_role[]));

create policy "team_members_select" on public.team_members for select to authenticated
  using (public.is_member_of(company_id));
create policy "team_members_manage" on public.team_members for all to authenticated
  using (public.has_company_role(company_id, array['owner','admin','manager']::public.app_role[]))
  with check (public.has_company_role(company_id, array['owner','admin','manager']::public.app_role[]));

create policy "settings_select" on public.company_settings for select to authenticated
  using (public.is_member_of(company_id));
create policy "settings_manage" on public.company_settings for all to authenticated
  using (public.has_company_role(company_id, array['owner','admin']::public.app_role[]))
  with check (public.has_company_role(company_id, array['owner','admin']::public.app_role[]));

create policy "ai_settings_select" on public.company_ai_settings for select to authenticated
  using (public.is_member_of(company_id));
create policy "ai_settings_manage" on public.company_ai_settings for all to authenticated
  using (public.has_company_role(company_id, array['owner','admin']::public.app_role[]))
  with check (public.has_company_role(company_id, array['owner','admin']::public.app_role[]));

create policy "retention_select" on public.company_retention_policies for select to authenticated
  using (public.is_member_of(company_id));
create policy "retention_manage" on public.company_retention_policies for all to authenticated
  using (public.has_company_role(company_id, array['owner','admin']::public.app_role[]))
  with check (public.has_company_role(company_id, array['owner','admin']::public.app_role[]));

create policy "prefs_own" on public.user_preferences for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "invites_select" on public.invitations for select to authenticated
  using (public.is_member_of(company_id) or lower(email) = lower(coalesce(auth.jwt()->>'email','')));
create policy "invites_manage" on public.invitations for all to authenticated
  using (public.has_company_role(company_id, array['owner','admin']::public.app_role[]))
  with check (public.has_company_role(company_id, array['owner','admin']::public.app_role[]));

create policy "onboarding_select" on public.onboarding_checklists for select to authenticated
  using (public.is_member_of(company_id));
create policy "onboarding_manage" on public.onboarding_checklists for all to authenticated
  using (public.has_company_role(company_id, array['owner','admin']::public.app_role[]))
  with check (public.has_company_role(company_id, array['owner','admin']::public.app_role[]));

create policy "scorecards_select" on public.scorecards for select to authenticated
  using (public.is_member_of(company_id));
create policy "scorecards_manage" on public.scorecards for all to authenticated
  using (public.has_company_role(company_id, array['owner','admin','manager','qa']::public.app_role[]))
  with check (public.has_company_role(company_id, array['owner','admin','manager','qa']::public.app_role[]));

create policy "audit_select" on public.audit_logs for select to authenticated
  using (company_id is not null and public.has_company_role(company_id, array['owner','admin']::public.app_role[]));
create policy "audit_insert" on public.audit_logs for insert to authenticated
  with check (company_id is null or public.is_member_of(company_id));
