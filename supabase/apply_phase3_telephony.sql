-- Paste into Supabase SQL Editor if you are not using `supabase db push`.
-- Phase 3: Click-to-call telephony

alter table public.profiles
  add column if not exists phone_e164 text,
  add column if not exists phone_verified_at timestamptz,
  add column if not exists dialer_device text not null default 'phone';

create table if not exists public.company_telephony_settings (
  company_id uuid primary key references public.companies(id) on delete cascade,
  enabled boolean not null default false,
  provider text not null default 'twilio',
  caller_id_e164 text,
  record_calls boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.phone_verification_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  phone_e164 text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts int not null default 0,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists phone_verify_user_idx
  on public.phone_verification_challenges (user_id, created_at desc);

grant select, insert, update, delete on public.company_telephony_settings to authenticated;
grant all on public.company_telephony_settings to service_role;
grant select, insert, update, delete on public.phone_verification_challenges to authenticated;
grant all on public.phone_verification_challenges to service_role;

alter table public.company_telephony_settings enable row level security;
alter table public.phone_verification_challenges enable row level security;

drop policy if exists "telephony_select" on public.company_telephony_settings;
create policy "telephony_select" on public.company_telephony_settings
  for select to authenticated
  using (public.is_member_of(company_id));

drop policy if exists "telephony_manage" on public.company_telephony_settings;
create policy "telephony_manage" on public.company_telephony_settings
  for all to authenticated
  using (
    public.has_company_role(company_id, array['owner','admin','platform_admin']::public.app_role[])
  )
  with check (
    public.has_company_role(company_id, array['owner','admin','platform_admin']::public.app_role[])
  );

drop policy if exists "phone_challenge_own" on public.phone_verification_challenges;
create policy "phone_challenge_own" on public.phone_verification_challenges
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
