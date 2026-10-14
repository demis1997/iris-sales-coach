begin;
create table public.crm_outbox(id uuid primary key default gen_random_uuid(),company_id uuid not null,call_id uuid not null,kind text not null default 'call_completed',idempotency_key text not null unique,state text not null default 'blocked' check(state in('blocked','queued','running','completed','failed')),attempt int not null default 0,external_id text,error_code text not null default 'crm_provider_not_configured',available_at timestamptz not null default now(),created_at timestamptz not null default now(),foreign key(company_id,call_id) references public.calls(company_id,id) on delete cascade);
alter table public.crm_outbox enable row level security;
grant all on public.crm_outbox to service_role;
grant select on public.crm_outbox to authenticated;
create policy crm_outbox_read on public.crm_outbox for select to authenticated using(public.can_read_call(company_id,call_id));
create function public.queue_crm_call() returns trigger language plpgsql security invoker set search_path=public as $$
begin
 insert into crm_outbox(company_id,call_id,idempotency_key) values(new.company_id,new.call_id,new.company_id::text||'/call/'||new.call_id::text) on conflict(idempotency_key) do nothing;
 return new;
end $$;
create trigger queue_call_for_crm after insert or update on public.call_ai_analyses for each row execute function public.queue_crm_call();
commit;
