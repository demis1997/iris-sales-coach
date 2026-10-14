begin;
create table public.voice_sessions(id uuid primary key default gen_random_uuid(),company_id uuid not null,call_id uuid not null,provider_call_sid text not null,token_hash text not null unique,mode text not null check(mode in('coach','agent')),workflow jsonb,expires_at timestamptz not null,state text not null default 'pending',stream_sid text,foreign key(company_id,call_id) references public.calls(company_id,id) on delete cascade);
revoke all on public.voice_sessions from anon,authenticated;
grant all on public.voice_sessions to service_role;
create table public.live_call_events(id bigint generated always as identity primary key,company_id uuid not null,call_id uuid not null,kind text not null,payload jsonb not null,created_at timestamptz not null default now(),foreign key(company_id,call_id) references public.calls(company_id,id) on delete cascade);
alter table public.live_call_events enable row level security;
grant select on public.live_call_events to authenticated;
grant all on public.live_call_events to service_role;
grant usage,select on sequence public.live_call_events_id_seq to service_role;
create policy live_event_read on public.live_call_events for select to authenticated using(public.can_read_call(company_id,call_id));
create function public.claim_voice_session(_hash text,_sid text,_stream text) returns setof public.voice_sessions language plpgsql security invoker set search_path=public as $$
declare v voice_sessions;
begin
 select * into v from voice_sessions where token_hash=_hash and provider_call_sid=_sid and state='pending' and expires_at>now() for update;
 if not found then return; end if;
 perform 1 from calls where company_id=v.company_id and id=v.call_id and deleted_at is null and provider='twilio' and status in('created','ringing','in_progress','provider_unknown') and (external_call_id is null or external_call_id=_sid) for update;
 if not found or exists(select 1 from voice_sessions where company_id=v.company_id and call_id=v.call_id and state='active') then return; end if;
 return query update voice_sessions set state='active',stream_sid=_stream where id=v.id returning *;
end $$;
revoke all on function public.claim_voice_session(text,text,text) from public,anon,authenticated;
grant execute on function public.claim_voice_session(text,text,text) to service_role;
do $$ begin if exists(select 1 from pg_publication where pubname='supabase_realtime') then alter publication supabase_realtime add table public.live_call_events; end if; end $$;
-- Company numbers route inbound calls; ambiguous assignments fail the migration.
create unique index company_inbound_number on public.company_telephony_settings(caller_id_e164) where enabled and caller_id_e164 is not null;
create unique index provider_call_identity on public.calls(provider,external_call_id) where provider='twilio' and external_call_id is not null;
create table public.voice_workflows(company_id uuid primary key references public.companies(id),enabled boolean not null default false,configuration jsonb not null,updated_at timestamptz not null default now());
alter table public.voice_workflows enable row level security;
grant select,insert,update,delete on public.voice_workflows to authenticated;
grant all on public.voice_workflows to service_role;
create policy workflow_manage on public.voice_workflows for all to authenticated using(public.has_company_role(company_id,array['owner','admin']::public.app_role[])) with check(public.has_company_role(company_id,array['owner','admin']::public.app_role[]));

commit;
