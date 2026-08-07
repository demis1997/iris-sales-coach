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
