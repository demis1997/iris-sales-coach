-- Iris AI Revenue Intelligence schema extension
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
