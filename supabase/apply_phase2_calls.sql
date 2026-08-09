-- Phase 2: Calls, recordings, transcripts, processing jobs, analyses
-- Apply in Supabase SQL Editor after Phase 1.

create table if not exists public.calls (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  external_call_id text,
  provider text not null default 'upload',
  direction text not null default 'outbound',
  status text not null default 'received',
  agent_user_id uuid references auth.users(id) on delete set null,
  team_id uuid references public.teams(id) on delete set null,
  campaign_id uuid,
  contact_name text,
  contact_company text,
  phone_number text,
  started_at timestamptz,
  ended_at timestamptz,
  duration_seconds int,
  recording_status text not null default 'pending',
  transcription_status text not null default 'pending',
  analysis_status text not null default 'pending',
  language text default 'en',
  disposition text,
  outcome text,
  conversion_value numeric,
  currency text default 'EUR',
  is_converted boolean not null default false,
  consent_status text default 'unknown',
  overall_score numeric,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists calls_company_created_idx on public.calls (company_id, created_at desc);
create index if not exists calls_company_agent_idx on public.calls (company_id, agent_user_id, started_at desc);
create index if not exists calls_company_analysis_idx on public.calls (company_id, analysis_status);

create table if not exists public.call_recordings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  call_id uuid not null references public.calls(id) on delete cascade,
  storage_path text not null,
  file_name text,
  content_type text,
  byte_size bigint,
  duration_seconds int,
  created_at timestamptz not null default now()
);

create index if not exists call_recordings_call_idx on public.call_recordings (call_id);

create table if not exists public.call_processing_jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  call_id uuid not null references public.calls(id) on delete cascade,
  stage text not null default 'received',
  status text not null default 'queued',
  provider text,
  model text,
  attempt int not null default 0,
  error text,
  started_at timestamptz,
  completed_at timestamptz,
  cost_estimate numeric,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists call_jobs_call_idx on public.call_processing_jobs (call_id, created_at desc);

create table if not exists public.call_transcripts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  call_id uuid not null references public.calls(id) on delete cascade,
  full_text text,
  language text,
  provider text,
  model text,
  created_at timestamptz not null default now()
);

create table if not exists public.transcript_segments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  call_id uuid not null references public.calls(id) on delete cascade,
  transcript_id uuid not null references public.call_transcripts(id) on delete cascade,
  speaker text,
  speaker_type text,
  start_ms int not null default 0,
  end_ms int not null default 0,
  text text not null,
  confidence numeric,
  sentiment text,
  is_objection boolean not null default false,
  is_question boolean not null default false,
  is_compliance_risk boolean not null default false,
  is_key_moment boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists transcript_segments_call_idx on public.transcript_segments (call_id, start_ms);

create table if not exists public.call_ai_analyses (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  call_id uuid not null references public.calls(id) on delete cascade,
  summary_concise text,
  summary_detailed text,
  customer_intent text,
  outcome_category text,
  conversion_confidence numeric,
  overall_score numeric,
  scores jsonb default '{}'::jsonb,
  objections jsonb default '[]'::jsonb,
  coaching jsonb default '{}'::jsonb,
  next_actions jsonb default '[]'::jsonb,
  missed_opportunities jsonb default '[]'::jsonb,
  compliance_flags jsonb default '[]'::jsonb,
  customer_analysis jsonb default '{}'::jsonb,
  prompt_version text,
  provider text,
  model text,
  input_tokens int,
  output_tokens int,
  latency_ms int,
  raw jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists call_ai_analyses_call_uidx on public.call_ai_analyses (call_id);

create table if not exists public.daily_agent_metrics (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  agent_user_id uuid not null references auth.users(id) on delete cascade,
  metric_date date not null,
  calls_count int not null default 0,
  talk_seconds int not null default 0,
  avg_score numeric,
  conversions int not null default 0,
  created_at timestamptz not null default now(),
  unique (company_id, agent_user_id, metric_date)
);

create table if not exists public.daily_company_metrics (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  metric_date date not null,
  calls_count int not null default 0,
  avg_score numeric,
  conversions int not null default 0,
  conversion_rate numeric,
  created_at timestamptz not null default now(),
  unique (company_id, metric_date)
);

-- Storage bucket for call recordings (private)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'call-recordings',
  'call-recordings',
  false,
  104857600,
  array['audio/mpeg','audio/mp3','audio/wav','audio/x-wav','audio/mp4','audio/m4a','audio/webm','video/mp4','video/webm']
)
on conflict (id) do nothing;

-- Grants
grant select, insert, update, delete on public.calls to authenticated;
grant all on public.calls to service_role;
grant select, insert, update, delete on public.call_recordings to authenticated;
grant all on public.call_recordings to service_role;
grant select, insert, update, delete on public.call_processing_jobs to authenticated;
grant all on public.call_processing_jobs to service_role;
grant select, insert, update, delete on public.call_transcripts to authenticated;
grant all on public.call_transcripts to service_role;
grant select, insert, update, delete on public.transcript_segments to authenticated;
grant all on public.transcript_segments to service_role;
grant select, insert, update, delete on public.call_ai_analyses to authenticated;
grant all on public.call_ai_analyses to service_role;
grant select, insert, update, delete on public.daily_agent_metrics to authenticated;
grant all on public.daily_agent_metrics to service_role;
grant select, insert, update, delete on public.daily_company_metrics to authenticated;
grant all on public.daily_company_metrics to service_role;

alter table public.calls enable row level security;
alter table public.call_recordings enable row level security;
alter table public.call_processing_jobs enable row level security;
alter table public.call_transcripts enable row level security;
alter table public.transcript_segments enable row level security;
alter table public.call_ai_analyses enable row level security;
alter table public.daily_agent_metrics enable row level security;
alter table public.daily_company_metrics enable row level security;

-- RLS: members of company; agents only see own calls unless they have view_team/all (enforced in app + optional policies)
drop policy if exists "calls_select" on public.calls;
create policy "calls_select" on public.calls for select to authenticated
  using (
    public.is_member_of(company_id)
    and deleted_at is null
    and (
      agent_user_id = auth.uid()
      or public.has_company_role(company_id, array['owner','admin','ceo','manager','qa','team_leader','viewer','trainer']::public.app_role[])
    )
  );

drop policy if exists "calls_insert" on public.calls;
create policy "calls_insert" on public.calls for insert to authenticated
  with check (public.is_member_of(company_id));

drop policy if exists "calls_update" on public.calls;
create policy "calls_update" on public.calls for update to authenticated
  using (
    public.is_member_of(company_id)
    and (
      agent_user_id = auth.uid()
      or public.has_company_role(company_id, array['owner','admin','manager','qa','team_leader']::public.app_role[])
    )
  );

drop policy if exists "calls_delete" on public.calls;
create policy "calls_delete" on public.calls for update to authenticated
  using (public.has_company_role(company_id, array['owner','admin']::public.app_role[]));

create policy "recordings_select" on public.call_recordings for select to authenticated
  using (public.is_member_of(company_id));
create policy "recordings_insert" on public.call_recordings for insert to authenticated
  with check (public.is_member_of(company_id));

create policy "jobs_select" on public.call_processing_jobs for select to authenticated
  using (public.is_member_of(company_id));
create policy "jobs_insert" on public.call_processing_jobs for insert to authenticated
  with check (public.is_member_of(company_id));
create policy "jobs_update" on public.call_processing_jobs for update to authenticated
  using (public.is_member_of(company_id));

create policy "transcripts_select" on public.call_transcripts for select to authenticated
  using (public.is_member_of(company_id));
create policy "transcripts_insert" on public.call_transcripts for insert to authenticated
  with check (public.is_member_of(company_id));

create policy "segments_select" on public.transcript_segments for select to authenticated
  using (public.is_member_of(company_id));
create policy "segments_insert" on public.transcript_segments for insert to authenticated
  with check (public.is_member_of(company_id));

create policy "analyses_select" on public.call_ai_analyses for select to authenticated
  using (public.is_member_of(company_id));
create policy "analyses_insert" on public.call_ai_analyses for insert to authenticated
  with check (public.is_member_of(company_id));
create policy "analyses_update" on public.call_ai_analyses for update to authenticated
  using (public.is_member_of(company_id));

create policy "daily_agent_select" on public.daily_agent_metrics for select to authenticated
  using (
    public.is_member_of(company_id)
    and (
      agent_user_id = auth.uid()
      or public.has_company_role(company_id, array['owner','admin','ceo','manager','qa','team_leader','viewer']::public.app_role[])
    )
  );
create policy "daily_company_select" on public.daily_company_metrics for select to authenticated
  using (public.is_member_of(company_id));

-- Storage policies: path must start with company_id/
drop policy if exists "call_recordings_select" on storage.objects;
create policy "call_recordings_select" on storage.objects for select to authenticated
  using (
    bucket_id = 'call-recordings'
    and public.is_member_of((storage.foldername(name))[1]::uuid)
  );

drop policy if exists "call_recordings_insert" on storage.objects;
create policy "call_recordings_insert" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'call-recordings'
    and public.is_member_of((storage.foldername(name))[1]::uuid)
  );

drop policy if exists "call_recordings_update" on storage.objects;
create policy "call_recordings_update" on storage.objects for update to authenticated
  using (
    bucket_id = 'call-recordings'
    and public.is_member_of((storage.foldername(name))[1]::uuid)
  );
